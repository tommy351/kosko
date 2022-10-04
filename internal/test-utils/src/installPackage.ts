import { dirname, join } from "path";
import fs from "fs/promises";
import { projectRoot } from "./projectRoot";

export async function installPackage(
  path: string,
  name: string
): Promise<void> {
  const src = join(projectRoot, "packages", name);
  const dest = join(path, "node_modules/@kosko", name);

  await fs.mkdir(dirname(dest), { recursive: true });

  try {
    await fs.unlink(dest);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await fs.symlink(src, dest, "dir");
}
