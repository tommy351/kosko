import { createRootCommand as createRoot } from "@kosko/cli-utils";
import { generateCmd } from "./generate/command";
import { initCmd } from "./init";
import { validateCmd } from "./validate";
import { migrateCmd } from "./migrate";
import { version } from "../../package.json";

export function createRootCommand(args: readonly string[]) {
  return createRoot(args)
    .scriptName("kosko")
    .version(version)
    .command(initCmd)
    .command(generateCmd)
    .command(validateCmd)
    .command(migrateCmd)
    .demandCommand();
}
