import { join, posix } from "node:path";
import glob from "fast-glob";
import { readFile } from "node:fs/promises";

export async function listAllFiles(
  dir: string
): Promise<Record<string, string>> {
  const paths = await glob("**/*", { cwd: dir });
  const files: Record<string, string> = {};

  for (const path of paths) {
    files[posix.normalize(path)] = await readFile(join(dir, path), "utf8");
  }

  return files;
}
