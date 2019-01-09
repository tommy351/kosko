import Debug from "debug";
import fs from "fs";
import makeDir from "make-dir";
import { join, resolve } from "path";
import { promisify } from "util";
import writePkg from "write-pkg";
import { Command, getLogger, RootArguments } from "../cli/command";

const debug = Debug("kosko:cli:init");

const readFile = promisify(fs.readFile);

function exists(path: string) {
  return new Promise(res => fs.exists(path, res));
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
  await writePkg(path, {
    ...base,
    ...data
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
        "@kosko/env": "^0.2.0",
        "kubernetes-models": "^0.2.1"
      }
    });

    logger.success("Everything is set up");
  }
};
