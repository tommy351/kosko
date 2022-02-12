import fs from "fs-extra";
import { join } from "path";
import logger, { LogLevel } from "@kosko/log";
import { File } from "./template";

/**
 * Write files to the specified path.
 *
 * @param path Destination path
 * @param files Files to write
 */
export async function writeFiles(
  path: string,
  files: ReadonlyArray<File>
): Promise<void> {
  for (const file of files) {
    const filePath = join(path, file.path);

    logger.log(LogLevel.Info, `Writing file ${filePath}`);
    await fs.outputFile(filePath, file.content);
  }
}
