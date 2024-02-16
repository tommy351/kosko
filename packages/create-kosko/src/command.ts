import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import pc from "picocolors";
import { type GlobalArguments, CLIError } from "@kosko/cli-utils";
import logger, { LogLevel } from "@kosko/log";
import isFolderEmpty from "./is-folder-empty";
import { File, Template } from "./templates/base";
import cjsTemplate from "./templates/cjs";
import tsTemplate from "./templates/ts";
import esmTemplate from "./templates/esm";
import tsEsmTemplate from "./templates/ts-esm";
import {
  getPackageManager,
  getInstallCommand,
  installDependencies
} from "./install";
import { getErrorCode } from "@kosko/common-utils";
import type { CommandModule } from "yargs";
import prompts from "prompts";
import isInteractive from "is-interactive";
import { exit, stdout } from "node:process";

function onPromptState({ aborted }: { aborted: boolean }) {
  if (aborted) {
    // Re-enable terminal cursor otherwise it will remain hidden after exit.
    stdout.write("\x1B[?25h");
    stdout.write("\n");
    exit(1);
  }
}

async function getPath(
  args: Pick<Arguments, "path" | "interactive">
): Promise<string | undefined> {
  if (typeof args.path === "string") return args.path;
  if (!args.interactive) return;

  const res = await prompts({
    onState: onPromptState,
    type: "text",
    name: "path",
    message: "Project path",
    initial: "kosko-project"
  });

  return res.path;
}

async function checkPath({
  path,
  force,
  interactive
}: {
  path: string;
  force?: boolean;
  interactive?: boolean;
}): Promise<void> {
  try {
    logger.log(LogLevel.Debug, `Checking stats of "${path}"`);
    const stats = await stat(path);

    if (!stats.isDirectory()) {
      throw new CLIError("Destination already exists and is not a directory", {
        output:
          "Destination already exists and is not a directory. Please delete it or try another path."
      });
    }

    if (force) {
      return;
    }

    if (await isFolderEmpty(path)) {
      logger.log(LogLevel.Trace, "Path can be initialized because it is empty");
      return;
    }

    const overwrite = await confirm({
      interactive,
      message: "Destination already exists. Do you want to overwrite it?",
      fallback: false
    });

    if (overwrite) return;

    throw new CLIError("Destination already exists", {
      output: `Destination already exists. Please empty the directory or rerun with "--force" to proceed.`
    });
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;

    logger.log(
      LogLevel.Trace,
      "Path can be initialized because it does not exist yet"
    );
  }
}

async function confirm({
  message,
  interactive,
  initial,
  fallback
}: {
  /**
   * Prompt message.
   */
  message: string;
  /**
   * Enable interactive mode. When the value is undefined, and interactive is
   * false, it will return the fallback value.
   */
  interactive?: boolean;
  /**
   * Default value for the prompt.
   */
  initial?: boolean;
  /**
   * Fallback value when interactive mode is disabled.
   */
  fallback: boolean;
}): Promise<boolean> {
  if (!interactive) return fallback;

  const res = await prompts({
    onState: onPromptState,
    type: "confirm",
    name: "confirm",
    message,
    initial
  });

  return res.confirm;
}

function resolvePath(cwd: string, path?: string): string {
  return path ? resolve(cwd, path) : cwd;
}

async function writeFiles(path: string, files: readonly File[]): Promise<void> {
  for (const file of files) {
    const filePath = join(path, file.path);

    logger.log(LogLevel.Debug, `Writing file: "${file.path}"`);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, file.content);
  }
}

function getCDPath(cwd: string, path: string): string | undefined {
  if (cwd === path) return;

  if (path.startsWith(cwd + sep)) {
    return relative(cwd, path);
  }

  return path;
}

export interface Arguments extends GlobalArguments {
  force?: boolean;
  path?: string;
  typescript?: boolean;
  esm?: boolean;
  install?: boolean;
  packageManager?: string;
  interactive: boolean;
}

export const command: CommandModule<GlobalArguments, Arguments> = {
  command: "$0 [path]",
  describe: "Set up a new Kosko project",
  builder(argv) {
    // Don't set the default value if we are going to prompt the user. Set the
    // defaultDescription instead.
    return argv
      .positional("path", { type: "string", describe: "Path to initialize" })
      .option("force", {
        type: "boolean",
        describe: "Overwrite existing files",
        alias: "f"
      })
      .option("typescript", {
        type: "boolean",
        describe: "Generate TypeScript files",
        alias: "ts",
        defaultDescription: "true"
      })
      .option("esm", {
        type: "boolean",
        describe: "Generate ECMAScript module (ESM) files"
      })
      .option("install", {
        type: "boolean",
        describe: "Install dependencies automatically"
      })
      .option("package-manager", {
        type: "string",
        describe: "Package manager (npm, yarn, pnpm)",
        alias: "pm",
        defaultDescription: "auto"
      })
      .option("interactive", {
        type: "boolean",
        describe: "Run in interactive mode",
        default: isInteractive(),
        defaultDescription: "auto"
      });
  },
  async handler(args) {
    const path = resolvePath(args.cwd, await getPath(args));

    await checkPath({ path, force: args.force, interactive: args.interactive });

    args.typescript ??= await confirm({
      message: "Would you like to use TypeScript?",
      interactive: args.interactive,
      // Set to true because we prefer to use TypeScript.
      initial: true,
      fallback: true
    });

    args.esm ??= await confirm({
      interactive: args.interactive,
      message: "Would you like to use ECMAScript module (ESM)?",
      fallback: false
    });

    args.install ??= await confirm({
      interactive: args.interactive,
      message: "Would you like to install dependencies automatically?",
      // Set to true because we prefer to install dependencies
      // automatically.
      initial: true,
      // Set to false because users probably don't want to install dependencies
      // automatically when they are running in non-interactive mode.
      fallback: false
    });

    logger.log(LogLevel.Info, `Creating a Kosko project in "${path}"`);

    const template: Template = (() => {
      if (args.typescript) {
        return args.esm ? tsEsmTemplate : tsTemplate;
      }

      return args.esm ? esmTemplate : cjsTemplate;
    })();

    const packageManager = args.packageManager || getPackageManager();
    const runCmd = `${packageManager} run`;
    const { dependencies, devDependencies, files } = await template({ path });

    await writeFiles(path, files);

    const cdPath = getCDPath(args.cwd, path);
    let installSuccessful = false;

    if (args.install) {
      try {
        if (dependencies?.length) {
          await installDependencies({
            cwd: path,
            packageManager,
            dependencies
          });
        }

        if (devDependencies?.length) {
          await installDependencies({
            cwd: path,
            packageManager,
            dependencies: devDependencies,
            dev: true
          });
        }

        installSuccessful = true;
      } catch (err) {
        logger.log(LogLevel.Warn, "Install failed", { error: err });
      }
    }

    logger.log(
      LogLevel.Info,
      `Project created at "${path}"

Inside that directory, you can run several commands:
${[
  [
    `${runCmd} generate`,
    "Validate components and generate Kubernetes manifests."
  ],
  [`${runCmd} validate`, "Only validate components."]
]
  .map(([cmd, desc]) => `\n  ${pc.cyan(cmd)}\n    ${desc}`)
  .join("\n")}

We suggest that you begin by typing:

${[
  ...(cdPath ? [`cd ${cdPath}`] : []),
  ...(args.install && installSuccessful
    ? []
    : [
        dependencies?.length
          ? getInstallCommand({ packageManager, dependencies }).join(" ")
          : "",
        devDependencies?.length
          ? getInstallCommand({
              packageManager,
              dependencies: devDependencies,
              dev: true
            }).join(" ")
          : ""
      ]),
  `${runCmd} generate`
]
  .filter(Boolean)
  .map((line) => `  ${pc.cyan(line)}`)
  .join("\n")}`
    );
  }
};
