import execa from "execa";
import { join } from "node:path";
import { projectRoot } from "@kosko/test-utils";

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
      join(projectRoot, "packages/cli/templates/deno/import_map.json"),
      "npm:kosko",
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
