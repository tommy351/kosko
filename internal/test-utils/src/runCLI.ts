import execa from "execa";
import { join } from "node:path";
import { projectRoot } from "./projectRoot";

export async function runCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(join(projectRoot, "packages/kosko/bin/kosko.js"), args, {
    ...options,
    env: {
      LC_ALL: "en_US",
      ...options.env
    }
  });
}
