import { CommandModule, Argv, Arguments } from "yargs";
import { resolve } from "path";
import fs from "fs";
import { exists } from "../utils/fs";
import { logger } from "../utils/log";

interface InitArguments extends Arguments {
  force?: boolean;
  path?: string;
}

export const initCommand: CommandModule = {
  command: "init [path]",
  describe: "Initialize data for kosko in a directory.",
  builder(argv: Argv) {
    return argv
      .option("force", {
        alias: "f",
        describe: "Generate files even if the directory exists.",
        type: "boolean"
      })
      .positional("path", {
        type: "string",
        describe:
          "Specify the path to initialize, otherwise it will be the current directory."
      });
  },
  async handler(args: InitArguments) {
    const path = args.path ? resolve(args.path) : process.cwd();
    logger.info("Initialize in path", path);

    if (await exists(path, fs.constants.W_OK)) {
      if (!args.force && args.path) {
        logger.error(
          "Already initialized. Use --force to force the initialization."
        );
        return;
      }
    }

    // TODO: Write some files

    logger.success(
      `Everything is set up now. Go to read docs or try "kosko generate".`
    );
  }
};
