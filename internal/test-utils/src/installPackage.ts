import { dirname, join } from "node:path";
import { mkdir, symlink, unlink } from "node:fs/promises";
import { projectRoot } from "./projectRoot";

export async function installPackage(
  path: string,
  name: string
): Promise<string> {
  const src = join(projectRoot, "packages", name);
  const dest = join(path, "node_modules/@kosko", name);

  await mkdir(dirname(dest), { recursive: true });

  try {
    await unlink(dest);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await symlink(src, dest, "dir");

  return dest;
}
