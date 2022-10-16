import { dirname, join } from "node:path";
import fs from "node:fs/promises";
import { projectRoot } from "./projectRoot";
import { getErrorCode } from "@kosko/utils";

export async function installPackage(
  path: string,
  name: string
): Promise<string> {
  const src = join(projectRoot, "packages", name);
  const dest = join(path, "node_modules/@kosko", name);

  await fs.mkdir(dirname(dest), { recursive: true });

  try {
    await fs.unlink(dest);
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
  }

  await fs.symlink(src, dest, "dir");

  return dest;
}
