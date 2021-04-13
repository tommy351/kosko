import execa from "execa";
import { join, dirname } from "path";
import fs from "fs-extra";

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

  await fs.ensureSymlink(src, dest, "dir");
}
