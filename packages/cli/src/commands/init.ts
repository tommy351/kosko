import fs from "fs-extra";
import { join, resolve } from "path";
import { Command, RootArguments } from "../cli/command";
import { CLIError } from "../cli/error";
import logger, { LogLevel } from "@kosko/log";

const DEFAULT_CONFIG = `components = ["*"]`;

function sortKeys(data: any): any {
  const result: any = {};

  for (const key of Object.keys(data).sort()) {
    result[key] = data[key];
  }

  return result;
}

async function updatePkg(path: string, data: any): Promise<void> {
  let base: any = {};

  try {
    logger.log(LogLevel.Debug, `Reading existing package.json from "${path}"`);
    base = JSON.parse(await fs.readFile(path, "utf8"));
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  logger.log(LogLevel.Debug, `Writing package.json at "${path}"`);
  await fs.writeJSON(
    path,
    {
      ...base,
      ...data,
      dependencies: sortKeys({
        ...base.dependencies,
        ...data.dependencies
      })
    },
    { spaces: 2 }
  );
}

export interface InitArguments extends RootArguments {
  force: boolean;
  path?: string;
}

export const initCmd: Command<InitArguments> = {
  command: "init [path]",
  describe: "Set up a new kosko directory",
  builder(argv) {
    /* istanbul ignore next */
    return argv
      .option("force", {
        type: "boolean",
        describe: "Overwrite existing files",
        default: false,
        alias: "f"
      })
      .positional("path", { type: "string", describe: "Path to initialize" })
      .example("$0 init", "Initialize in current directory")
      .example("$0 init example", "Initialize in specified directory");
  },
  async handler(args) {
    const path = args.path ? resolve(args.cwd, args.path) : args.cwd;
    logger.log(LogLevel.Info, `Initialize in "${path}"`);

    const exist = await fs.pathExists(path);

    if (exist && !args.force) {
      throw new CLIError("Already exists", {
        output: `Already exists. Use "--force" to overwrite existing files.`
      });
    }

    for (const name of ["components", "environments", "templates"]) {
      const dir = join(path, name);
      logger.log(LogLevel.Debug, `Creating directory "${dir}"`);
      await fs.ensureDir(dir);
    }

    await updatePkg(join(path, "package.json"), {
      dependencies: {
        "@kosko/env": "^3.0.0",
        kosko: "^2.0.0",
        "kubernetes-models": "^3.0.0"
      }
    });

    const configPath = join(path, "kosko.toml");
    logger.log(LogLevel.Debug, `Writing config at "${configPath}"`);
    await fs.writeFile(configPath, DEFAULT_CONFIG);

    logger.log(
      LogLevel.Info,
      `We are almost there. Run "npm install" to finish the setup.`
    );
  }
};
