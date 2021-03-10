import execa from "execa";
import { join, dirname } from "path";
import makeDir from "make-dir";
import symlinkDir from "symlink-dir";

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

  await makeDir(dirname(dest));
  await symlinkDir(src, dest);
}
