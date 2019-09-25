import execa from "execa";
import { join, dirname } from "path";
import symlinkDir from "symlink-dir";

const root = dirname(__dirname);

export async function runCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(join(root, "packages", "cli", "bin", "kosko.js"), args, {
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
  await symlinkDir(
    join(root, "packages", name),
    join(path, "node_modules", "@kosko", name)
  );
}
