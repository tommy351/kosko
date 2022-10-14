import fs from "fs/promises";
import { dirname, join, relative, resolve, sep } from "path";
import pc from "picocolors";
import { Command, RootArguments } from "../../cli/command";
import { CLIError } from "../../cli/error";
import logger, { LogLevel } from "@kosko/log";
import isFolderEmpty from "./isFolderEmpty";
import { File, Template } from "./templates/base";
import cjsTemplate from "./templates/cjs";
import tsTemplate from "./templates/ts";
import esmTemplate from "./templates/esm";
import tsEsmTemplate from "./templates/ts-esm";
import {
  detectPackageManager,
  getInstallCommand,
  installDependencies
} from "./install";

async function checkPath(path: string, force?: boolean) {
  try {
    logger.log(LogLevel.Debug, `Checking stats of "${path}"`);
    const stats = await fs.stat(path);

    if (!stats.isDirectory()) {
      throw new CLIError("Destination already exists and is not a directory", {
        output:
          "Destination already exists and is not a directory. Please delete it or try another path."
      });
    }

    if (force) {
      return true;
    }

    if (await isFolderEmpty(path)) {
      logger.log(LogLevel.Trace, "Path can be initialized because it is empty");
      return;
    }

    throw new CLIError("Destination already exists", {
      output: `Destination already exists. Please empty the directory or rerun with "--force" to proceed.`
    });
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;

    logger.log(
      LogLevel.Trace,
      "Path can be initialized because it does not exist yet"
    );
  }
}

async function writeFiles(path: string, files: readonly File[]) {
  for (const file of files) {
    const filePath = join(path, file.path);

    logger.log(LogLevel.Debug, `Writing file: "${file.path}"`);
    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.content);
  }
}

function getCDPath(cwd: string, path: string): string | undefined {
  if (cwd === path) return;

  if (path.startsWith(cwd + sep)) {
    return relative(cwd, path);
  }

  return path;
}

export interface InitArguments extends RootArguments {
  force: boolean;
  path?: string;
  typescript?: boolean;
  esm?: boolean;
  install?: boolean;
  packageManager?: string;
}

export const initCmd: Command<InitArguments> = {
  command: "init [path]",
  describe: "Set up a new Kosko directory",
  builder(argv) {
    /* istanbul ignore next */
    return argv
      .option("force", {
        type: "boolean",
        describe: "Overwrite existing files",
        default: false,
        alias: "f"
      })
      .option("typescript", {
        type: "boolean",
        describe: "Generate TypeScript files",
        alias: "ts"
      })
      .option("esm", {
        type: "boolean",
        describe: "Generate ECMAScript module (ESM) files"
      })
      .option("install", {
        type: "boolean",
        describe: "Install dependencies automatically",
        default: true
      })
      .option("package-manager", {
        type: "string",
        describe: "Package manager (npm, yarn, pnpm)",
        alias: "pm"
      })
      .positional("path", { type: "string", describe: "Path to initialize" })
      .example("$0 init", "Initialize in current directory")
      .example("$0 init example", "Initialize in specified directory")
      .example("$0 init --typescript", "Setup a TypeScript project");
  },
  async handler(args) {
    const path = args.path ? resolve(args.cwd, args.path) : args.cwd;

    await checkPath(path, args.force);

    logger.log(LogLevel.Info, `Creating a Kosko project in "${path}"`);

    let template: Template = cjsTemplate;

    if (args.typescript) {
      if (args.esm) {
        template = tsEsmTemplate;
      } else {
        template = tsTemplate;
      }
    } else if (args.esm) {
      template = esmTemplate;
    }

    const packageManager =
      args.packageManager ?? (await detectPackageManager(path));
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
    `${packageManager} run generate`,
    "Validate components and generate Kubernetes manifests."
  ],
  [`${packageManager} run validate`, "Only validate components."]
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
  `${packageManager} run generate`
]
  .filter(Boolean)
  .map((line) => `  ${pc.cyan(line)}`)
  .join("\n")}`
    );
  }
};
