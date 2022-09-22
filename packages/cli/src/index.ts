/**
 * @packageDocumentation
 * @module @kosko/cli
 */

import { hideBin } from "yargs/helpers";
import { parse } from "./cli/command";
import { rootCmd } from "./commands/root";

export { handleError } from "./cli/error";

/**
 * Runs CLI with the given arguments.
 */
export async function run(
  argv: readonly string[] = hideBin(process.argv)
): Promise<void> {
  await parse(rootCmd, argv);
}
