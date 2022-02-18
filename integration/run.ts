import execa from "execa";
import { join, dirname } from "path";
import fs from "fs";

const root = dirname(__dirname);

export async function runCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(join(root, "packages", "kosko", "bin", "kosko.js"), args, {
    ...options,
    env: {
      LC_ALL: "en_US",
      ...options.env
    }
  });
}

export async function installPackage(
  path: string,
  name: string
): Promise<void> {
  const src = join(root, "packages", name);
  const dest = join(path, "node_modules", "@kosko", name);

  await fs.promises.mkdir(dirname(dest), { recursive: true });

  try {
    await fs.promises.unlink(dest);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await fs.promises.symlink(src, dest, "dir");
}
