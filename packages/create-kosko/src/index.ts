import { createRootCommand, parse } from "@kosko/cli-utils";
import { argv } from "node:process";
import { version } from "../package.json";
import { command } from "./command";

export { handleError } from "@kosko/cli-utils";

function createCommand(args: readonly string[]) {
  return createRootCommand(args)
    .scriptName("create-kosko")
    .version(version)
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
