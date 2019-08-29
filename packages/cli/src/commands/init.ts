import fs from "fs";
import makeDir from "make-dir";
import { join, resolve } from "path";
import { promisify } from "util";
import { Command, getLogger, RootArguments } from "../cli/command";
import Debug from "../cli/debug";
import { CLIError } from "../cli/error";

const debug = Debug.extend("init");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DEFAULT_CONFIG = `components = ["*"]`;

function exists(path: string): Promise<boolean> {
  return new Promise((res): void => fs.exists(path, res));
}

export function writeJSON(path: string, data: any): Promise<void> {
  return writeFile(path, JSON.stringify(data, null, "  "));
}

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
    debug("Reading existing package.json from", path);
    base = JSON.parse(await readFile(path, "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  debug("Writing package.json at", path);
  await writeJSON(path, {
    ...base,
    ...data,
    dependencies: sortKeys({
      ...base.dependencies,
      ...data.dependencies
    })
  });
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
    const logger = getLogger(args);
    const path = args.path ? resolve(args.cwd, args.path) : args.cwd;
    logger.info("Initialize in", path);

    const exist = await exists(path);

    if (exist && !args.force) {
      throw new CLIError("Already exists", {
        output: `Already exists. Use "--force" to overwrite existing files.`
      });
    }

    for (const name of ["components", "environments", "templates"]) {
      const dir = join(path, name);
      debug("Creating directory", dir);
      await makeDir(dir);
    }

    await updatePkg(join(path, "package.json"), {
      dependencies: {
        "@kosko/env": "^0.4.1",
        "kubernetes-models": "^0.5.0"
      }
    });

    const configPath = join(path, "kosko.toml");
    debug("Writing config", configPath);
    await writeFile(configPath, DEFAULT_CONFIG);

    logger.success(
      `We are almost there. Run "npm install" to finish the setup.`
    );
  }
};
