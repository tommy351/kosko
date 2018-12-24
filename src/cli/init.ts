import fs from "fs";
import { resolve, join } from "path";
import { Argv, CommandModule } from "yargs";
import { File, writeFiles } from "../templates";
import { exists } from "../utils/fs";
import { GlobalArguments, newContext } from "./base";
import { COMPONENT_DIR, ENVIRONMENT_DIR, Context } from "../context";

interface InitArguments extends GlobalArguments {
  force?: boolean;
  path?: string;
}

async function initHandler({ cwd, logger }: Context, args: InitArguments) {
  const path = args.path ? resolve(args.path) : cwd;
  logger.info("Initialize in path", path);

  if (await exists(path, fs.constants.W_OK)) {
    if (!args.force) {
      return logger.error(
        "Already initialized. Use --force to overwrite existing files."
      );
    }
  }

  await writeFiles(path, files, {
    afterWritten(filePath) {
      logger.success("File is written", filePath);
    }
  });

  logger.success(`Everything is set up now.`);
}

function prettyJSON(data: any) {
  return JSON.stringify(data, null, "  ");
}

const files: File[] = [
  {
    path: "package.json",
    content: prettyJSON({
      private: true,
      dependencies: {
        "kubernetes-models": "^0.2.1",
        "require-dir": "^1.2.0"
      }
    })
  },
  {
    path: join(COMPONENT_DIR, ".gitkeep"),
    content: ""
  },
  {
    path: join(ENVIRONMENT_DIR, "index.js"),
    content: "module.exports = require('./' + kosko.env);"
  }
];

export const initCommand: CommandModule = {
  command: "init [path]",
  describe: "Initialize data for kosko",
  builder(argv: Argv) {
    return argv
      .option("force", {
        alias: "f",
        describe: "Generate files even if the directory exists",
        type: "boolean"
      })
      .positional("path", {
        type: "string",
        describe:
          "Specify the path to initialize, otherwise it will be the current directory"
      });
  },
  async handler(args: InitArguments) {
    await initHandler(newContext(args), args);
  }
};
