import fs from "fs";
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
import { installDependencies } from "./install";

async function checkPath(path: string, force?: boolean) {
  try {
    logger.log(LogLevel.Debug, `Checking stats of "${path}"`);
    const stats = await fs.promises.stat(path);

    if (!stats.isDirectory()) {
      throw new CLIError("Path is not a directory");
    }

    if (force) {
      return true;
    }

    if (await isFolderEmpty(path)) {
      logger.log(LogLevel.Trace, "Path can be initialized because it is empty");
      return;
    }

    throw new CLIError("Path already exists", {
      output: `Path already exists. Use "--force" to overwrite existing files.`
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
    await fs.promises.mkdir(dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, file.content);
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

    const files = await template({ path });

    await writeFiles(path, files);

    const cdPath = getCDPath(args.cwd, path);

    if (args.install) {
      await installDependencies(path);
    }

    logger.log(
      LogLevel.Info,
      `Project created at "${path}"

Inside that directory, you can run several commands:
${[
  [
    "npm run generate",
    "Validate components and generate Kubernetes manifests."
  ],
  ["npm run validate", "Only validate components."]
]
  .map(([cmd, desc]) => `\n  ${pc.cyan(cmd)}\n    ${desc}`)
  .join("\n")}

We suggest that you begin by typing:

${[
  ...(cdPath ? [`cd ${cdPath}`] : []),
  ...(args.install ? [] : ["npm install"]),
  `npm run generate`
]
  .filter(Boolean)
  .map((line) => `  ${pc.cyan(line)}`)
  .join("\n")}`
    );
  }
};
