import { generateCmd } from "./generate/command";
import { initCmd } from "./init";
import { validateCmd } from "./validate";
import { migrateCmd } from "./migrate";
import { version } from "../../package.json";
import yargs from "yargs";
import { globalOptions, setupLogger } from "@kosko/cli-utils";

export function createRootCommand(args: readonly string[]) {
  return yargs(args)
    .scriptName("kosko")
    .version(version)
    .exitProcess(false)
    .options(globalOptions)
    .group(
      [...Object.keys(globalOptions), "help", "version"],
      "Global Options:"
    )
    .middleware(setupLogger)
    .command(initCmd)
    .command(generateCmd)
    .command(validateCmd)
    .command(migrateCmd)
    .demandCommand();
}
