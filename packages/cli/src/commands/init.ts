import Debug from "debug";
import fs from "fs";
import makeDir from "make-dir";
import { join, resolve } from "path";
import { promisify } from "util";
import writePkg from "write-pkg";
import { RootArguments, Command, getLogger } from "../cli/command";

const debug = Debug("kosko:init");
const writeFile = promisify(fs.writeFile);

function exists(path: string) {
  return new Promise(res => fs.exists(path, res));
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
      .positional("path", { type: "string", describe: "Path to initialize" });
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

    const componentDir = join(path, "components");
    const envDir = join(path, "environments");
    const templateDir = join(path, "templates");

    for (const dir of [componentDir, envDir, templateDir]) {
      debug("Creating directory", dir);
      await makeDir(dir);
    }

    debug("Writing env index");

    await writeFile(
      join(envDir, "index.js"),
      'module.exports = require("./" + kosko.env);'
    );

    debug("Updating package.json");

    await writePkg(join(path, "package.json"), {
      dependencies: {
        "kubernetes-models": "^0.2.1",
        "require-dir": "^1.2.0"
      }
    });

    logger.success("Everything is set up");
  }
};
