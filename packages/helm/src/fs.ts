import { getErrorCode } from "@kosko/common-utils";
import { cp, rename, rm, stat } from "node:fs/promises";

export async function move(src: string, dest: string): Promise<void> {
  try {
    await rename(src, dest);
  } catch (err) {
    if (getErrorCode(err) !== "EXDEV") throw err;

    await cp(src, dest, {
      recursive: true,
      errorOnExist: true,
      preserveTimestamps: true
    });
    await rm(src, { recursive: true, force: true });
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
    return false;
  }
}
