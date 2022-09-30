import execa from "execa";
import { dirname, join } from "path";
import fs from "fs/promises";

const root = join(__dirname, "../../..");

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

  await fs.mkdir(dirname(dest), { recursive: true });

  try {
    await fs.unlink(dest);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await fs.symlink(src, dest, "dir");
}
