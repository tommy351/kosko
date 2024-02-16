import { globalOptions, parse, setupLogger } from "@kosko/cli-utils";
import { argv } from "node:process";
import { version } from "../package.json";
import { command } from "./command";
import yargs from "yargs";

export { handleError } from "@kosko/cli-utils";

function createCommand(args: readonly string[]) {
  return yargs(args)
    .scriptName("create-kosko")
    .version(version)
    .exitProcess(false)
    .options(globalOptions)
    .group(
      [...Object.keys(globalOptions), "help", "version"],
      "Global Options:"
    )
    .middleware(setupLogger)
    .command(command);
}

/**
 * Runs CLI with the given arguments.
 *
 * @public
 */
export async function run(
  args: readonly string[] = argv.slice(2)
): Promise<void> {
  await parse(createCommand(args), args);
}
