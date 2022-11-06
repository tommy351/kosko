/**
 * CLI.
 *
 * @packageDocumentation
 */

import { parse } from "./cli/command";
import { rootCmd } from "./commands/root";

export { handleError } from "./cli/error";

/**
 * Runs CLI with the given arguments.
 *
 * @public
 */
export async function run(
  argv: readonly string[] = process.argv.slice(2)
): Promise<void> {
  await parse(rootCmd, argv);
}
