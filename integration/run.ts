import execa from "execa";
import pkgDir from "pkg-dir";
import { join } from "path";

export async function runCLI(args: string[], options?: execa.Options) {
  const root = await pkgDir();
  return execa(
    join(root!, "packages", "cli", "bin", "kosko.js"),
    args,
    options
  );
}
