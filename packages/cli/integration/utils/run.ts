import execa from "execa";
import { join } from "node:path";
import { projectRoot } from "@kosko/test-utils";

export async function runNodeCLI(
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
      join(projectRoot, "packages/kosko/deno.js"),
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
