import execa from "execa";
import { join } from "node:path";
import { projectRoot } from "@kosko/test-utils";

const BIN_PATH = join(projectRoot, "packages/kosko/bin/kosko.js");

export async function runNodeCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(BIN_PATH, args, {
    ...options,
    env: {
      // Set locale to en_US to make sure the output is consistent
      LC_ALL: "en_US",
      // Always enable console colors to make sure the output is consistent
      FORCE_COLOR: "1",
      ...options.env
    }
  });
}
