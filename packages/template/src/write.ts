import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import logger, { LogLevel } from "@kosko/log";
import { File } from "./template";

/**
 * Write files to the specified path.
 *
 * @param path - Destination path
 * @param files - Files to write
 * @public
 */
export async function writeFiles(
  path: string,
  files: readonly File[]
): Promise<void> {
  for (const file of files) {
    const filePath = join(path, file.path);

    logger.log(LogLevel.Info, `Writing file ${filePath}`);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, file.content);
  }
}
