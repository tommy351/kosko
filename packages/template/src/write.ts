import fs from "fs";
import makeDir from "make-dir";
import { dirname, join } from "path";
import signale from "signale";
import { promisify } from "util";
import { File } from "./template";

const writeFile = promisify(fs.writeFile);

/**
 * Write files to the specified path.
 *
 * @param path Destination path
 * @param files Files to write
 */
export async function writeFiles(path: string, files: File[]) {
  for (const file of files) {
    const filePath = join(path, file.path);

    signale.info("Writing file", filePath);
    await makeDir(dirname(filePath));
    await writeFile(filePath, file.content);
  }
}
