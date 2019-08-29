import execa from "execa";
import pkgDir from "pkg-dir";
import { join } from "path";

export async function runCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  const root = await pkgDir();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return execa(join(root!, "packages", "cli", "bin", "kosko.js"), args, {
    ...options,
    env: {
      LC_ALL: "en_US",
      ...options.env
    }
  });
}
