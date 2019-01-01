import Debug from "debug";
import fs from "fs";
import makeDir from "make-dir";
import { join, resolve } from "path";
import { promisify } from "util";
import writePkg from "write-pkg";
import { BaseOptions, baseOptions, getCWD } from "../base";
import { help } from "../cli/help";
import { parse, ParseError } from "../cli/parse";
import { Command, OptionType } from "../cli/types";

const debug = Debug("kosko:init");
const writeFile = promisify(fs.writeFile);

function exists(path: string) {
  return new Promise(res => fs.exists(path, res));
}

export interface InitOptions extends BaseOptions {
  force?: boolean;
}

export interface InitArgs {
  path?: string;
}

export const initCmd: Command<InitOptions> = {
  usage: "kosko init [path]",
  description: "Set up a new kosko directory.",
  options: {
    ...baseOptions,
    force: {
      type: OptionType.Boolean,
      alias: "-f",
      description: "Overwrite existing files."
    }
  },
  args: [
    {
      name: "path",
      description:
        "Path to initialize. Default to the current working directory."
    }
  ],
  async exec(ctx, argv) {
    const { args, options, errors } = parse<InitOptions, InitArgs>(argv, this);

    if (options.help) {
      return help(this);
    }

    if (errors.length) {
      throw new ParseError(errors);
    }

    const cwd = getCWD(options);
    const path = args.path ? resolve(cwd, args.path) : cwd;
    ctx.logger.log("Initialize in", path);

    const exist = await exists(path);

    if (exist && !options.force) {
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

    ctx.logger.log("Everything is set up.");
  }
};
