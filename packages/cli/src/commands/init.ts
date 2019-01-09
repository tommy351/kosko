import Debug from "debug";
import fs from "fs";
import makeDir from "make-dir";
import { join, resolve } from "path";
import { promisify } from "util";
import { Command, getLogger, RootArguments } from "../cli/command";

const debug = Debug("kosko:cli:init");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function exists(path: string) {
  return new Promise(res => fs.exists(path, res));
}

export function writeJSON(path: string, data: any) {
  return writeFile(path, JSON.stringify(data, null, "  "));
}

function sortKeys(data: any) {
  const result: any = {};

  for (const key of Object.keys(data).sort()) {
    result[key] = data[key];
  }

  return result;
}

async function updatePkg(path: string, data: any) {
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
      throw new Error(
        "Already exists. Use --force to overwrite existing files."
      );
    }

    for (const name of ["components", "environments", "templates"]) {
      const dir = join(path, name);
      debug("Creating directory", dir);
      await makeDir(dir);
    }

    await updatePkg(join(path, "package.json"), {
      dependencies: {
        "@kosko/env": "^0.3.0",
        "kubernetes-models": "^0.2.1"
      }
    });

    logger.success("Everything is set up");
  }
};
