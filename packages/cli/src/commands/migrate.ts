import { migrateString } from "@kosko/migrate";
import fs from "fs/promises";
import getStdin from "get-stdin";
import { join, resolve } from "path";
import { Command, RootArguments } from "../cli/command";
import { print } from "../cli/print";
import logger, { LogLevel } from "@kosko/log";

function concatFiles(arr: ReadonlyArray<string>): string {
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
  return fs.readFile(path, "utf8");
}

async function readFilesInDir(dir: string): Promise<string> {
  logger.log(LogLevel.Debug, `Reading directory "${dir}"`);

  const files = await fs.readdir(dir);
  const contents = await Promise.all(
    files.map((file) => readFileString(join(dir, file)))
  );

  return concatFiles(contents);
}

function readFiles(
  cwd: string,
  files: ReadonlyArray<string>
): Promise<ReadonlyArray<string>> {
  return Promise.all(
    files.map(async (file) => {
      if (file === "-") {
        logger.log(LogLevel.Debug, "Reading from stdin");
        return getStdin();
      }

      const path = resolve(cwd, file);
      const stats = await fs.stat(path);

      return stats.isDirectory() ? readFilesInDir(path) : readFileString(path);
    })
  );
}

function toArray<T>(input: T): T[] {
  return Array.isArray(input) ? input : [input];
}

export interface MigrateArguments extends RootArguments {
  filename: any;
}

export const migrateCmd: Command<MigrateArguments> = {
  command: "migrate",
  describe: "Migrate YAML into components",
  builder(argv) {
    /* istanbul ignore next */
    return (
      argv
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
        .example("$0 migrate -f -", "Read from stdin")
    );
  },
  async handler(args) {
    const file = concatFiles(await readFiles(args.cwd, toArray(args.filename)));
    const content = await migrateString(file);

    await print(content);
  }
};
