import { RootArguments, Command } from "../cli/command";
import Debug from "../cli/debug";
import getStdin from "get-stdin";
import { join } from "path";
import fs from "fs";
import { promisify } from "util";
import { print } from "../cli/print";
import { migrateString } from "@kosko/migrate";

const debug = Debug.extend("migrate");
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);

function readFileString(path: string) {
  debug("Reading file", path);
  return readFile(path, "utf8");
}

async function readFilesInDir(dir: string) {
  debug("Reading directory", dir);

  const files = await readDir(dir);
  const contents = await Promise.all(
    files.map(file => readFileString(join(dir, file)))
  );

  return concatFiles(contents);
}

function concatFiles(arr: ReadonlyArray<string>): string {
  if (!arr.length) return "";
  return "---\n" + arr.join("---\n");
}

function readFiles(
  cwd: string,
  files: ReadonlyArray<string>
): Promise<ReadonlyArray<string>> {
  return Promise.all(
    files.map(async file => {
      if (file === "-") {
        debug("Reading from stdin");
        return getStdin();
      }

      const path = join(cwd, file);
      const stats = await stat(path);

      return stats.isDirectory() ? readFilesInDir(path) : readFileString(path);
    })
  );
}

export interface MigrateArguments extends RootArguments {
  filename: string[];
}

export const migrateCmd: Command<MigrateArguments> = {
  command: "migrate",
  describe: "Migrate YAML into components",
  builder(argv) {
    /* istanbul ignore next */
    return argv.option("filename", {
      type: "string",
      describe: "Files, directory or stdin to migrate",
      required: true,
      alias: "f",
      array: true
    });
  },
  async handler(args) {
    const content = migrateString(
      concatFiles(await readFiles(args.cwd, args.filename))
    );

    await print(content);
  }
};
