import makeDir from "make-dir";
import { join, dirname } from "path";
import fs from "fs";
import { promisify } from "util";
import Debug from "debug";

const debug = Debug("kosko:template");
const writeFile = promisify(fs.writeFile);

export interface Template<T> {
  description?: string;
  options?: { [P in keyof T]: Option<T[P]> };
  generate(options: T): Promise<Result>;
}

export interface Option<T> {
  type?: "string" | "boolean" | "number";
  default?: T | (() => T | undefined);
  description?: string;
  multiple?: boolean;
  options?: string[];
  required?: boolean;
  parse?(input: string): T;
}

export interface Result {
  files: File[];
}

export interface File {
  path: string;
  content: string;
}

export async function writeFiles(path: string, files: File[]) {
  for (const file of files) {
    const filePath = join(path, file.path);

    debug("writing file", filePath);
    await makeDir(dirname(filePath));
    await writeFile(filePath, file.content);
  }
}
