/**
 * CLI.
 *
 * @packageDocumentation
 */

import { parse } from "./cli/command";
import { createRootCommand } from "./commands/root";
import { argv } from "node:process";

export { handleError } from "./cli/error";

/**
 * Runs CLI with the given arguments.
 *
 * @public
 */
export async function run(
  args: readonly string[] = argv.slice(2)
): Promise<void> {
  await parse(createRootCommand(args), args);
}
