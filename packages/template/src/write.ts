import Debug from "debug";
import fs from "fs";
import makeDir from "make-dir";
import { dirname, join } from "path";
import { promisify } from "util";
import { File } from "./template";

const debug = Debug("kosko:template");
const writeFile = promisify(fs.writeFile);

export async function writeFiles(path: string, files: File[]) {
  for (const file of files) {
    const filePath = join(path, file.path);

    debug("writing file", filePath);
    await makeDir(dirname(filePath));
    await writeFile(filePath, file.content);
  }
}
