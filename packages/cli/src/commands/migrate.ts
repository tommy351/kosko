import { MigrateFormat, migrateString } from "@kosko/migrate";
import { readdir, readFile, stat } from "node:fs/promises";
import getStdin from "get-stdin";
import { join, resolve } from "node:path";
import { Command, RootArguments } from "../cli/command";
import { print } from "../cli/print";
import logger, { LogLevel } from "@kosko/log";
import { toArray } from "@kosko/common-utils";

function concatFiles(arr: readonly string[]): string {
  if (!arr.length) return "";
  let output = "";

  for (const s of arr) {
    if (!s.startsWith("---")) output += "---\n";
    output += s + "\n";
  }

  return output;
}

function readFileString(path: string): Promise<string> {
  logger.log(LogLevel.Debug, `Reading file "${path}"`);
  return readFile(path, "utf8");
}

async function readFilesInDir(dir: string): Promise<string> {
  logger.log(LogLevel.Debug, `Reading directory "${dir}"`);

  const files = await readdir(dir);
  const contents = await Promise.all(
    files.map((file) => readFileString(join(dir, file)))
  );

  return concatFiles(contents);
}

function readFiles(cwd: string, files: readonly string[]): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      if (file === "-") {
        logger.log(LogLevel.Debug, "Reading from stdin");
        return getStdin();
      }

      const path = resolve(cwd, file);
      const stats = await stat(path);

      return stats.isDirectory() ? readFilesInDir(path) : readFileString(path);
    })
  );
}

export interface MigrateArguments extends RootArguments {
  filename: string | string[];
  esm?: boolean;
}

export const migrateCmd: Command<MigrateArguments> = {
  command: "migrate",
  describe: "Migrate YAML into components",
  builder(argv) {
    /* istanbul ignore next */
    let base = argv
      // HACK: Don't set the type of filename option to "array" because yargs
      // can't parse `migrate -f -` properly.
      // Link: https://github.com/tommy351/kosko/issues/17
      .option("filename", {
        type: "string",
        describe: "File, directory to migrate",
        required: true,
        alias: "f"
      })
      .example("$0 migrate -f path/to/file", "Read from the path")
      .example("$0 migrate -f -", "Read from stdin");

    // eslint-disable-next-line no-restricted-globals
    if (process.env.BUILD_TARGET === "node") {
      base = base.option("esm", {
        type: "boolean",
        describe: "Generate ECMAScript module (ESM) files"
      });
    }

    return base;
  },
  async handler(args) {
    const file = concatFiles(await readFiles(args.cwd, toArray(args.filename)));
    const content = await migrateString(file, {
      ...(args.esm && { format: MigrateFormat.ESM })
    });

    await print(content);
  }
};
