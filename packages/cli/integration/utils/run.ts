import execa from "execa";
import { join } from "node:path";
import { projectRoot } from "@kosko/test-utils";
import { runCLI } from "@kosko/test-utils";

const BIN_PATH = join(projectRoot, "packages/kosko/bin/kosko.js");

export function runNodeCLI(args: readonly string[], options?: execa.Options) {
  return runCLI(BIN_PATH, args, options);
}
