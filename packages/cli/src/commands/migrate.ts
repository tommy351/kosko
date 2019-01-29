import { migrateString } from "@kosko/migrate";
import fs from "fs";
import getStdin from "get-stdin";
import { join, resolve } from "path";
import { promisify } from "util";
import { Command, RootArguments } from "../cli/command";
import Debug from "../cli/debug";
import { print } from "../cli/print";

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
  let output = "";

  for (const s of arr) {
    if (!s.startsWith("---")) output += "---\n";
    output += s + "\n";
  }

  return output;
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

      const path = resolve(cwd, file);
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
    const file = concatFiles(await readFiles(args.cwd, args.filename));
    const content = migrateString(file);

    await print(content);
  }
};
