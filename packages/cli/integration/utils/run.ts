import execa from "execa";
import { join } from "node:path";
import { projectRoot } from "@kosko/test-utils";

const BIN_PATH = join(projectRoot, "packages/kosko/bin/kosko.mjs");

export async function runNodeCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(BIN_PATH, args, {
    ...options,
    env: {
      LC_ALL: "en_US",
      ...options.env
    }
  });
}

export async function runDenoCLI(
  args: string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(
    "deno",
    [
      "run",
      "-A",
      "--import-map",
      join(projectRoot, "integration/deno-import-map.json"),
      BIN_PATH,
      ...args
    ],
    {
      ...options,
      env: {
        LC_ALL: "en_US",
        ...options.env
      }
    }
  );
}
