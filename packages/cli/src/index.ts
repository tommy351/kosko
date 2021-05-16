/**
 * @packageDocumentation
 * @module @kosko/cli
 */

import { args } from "@kosko/system-utils";
import { parse } from "./cli/command";
import { rootCmd } from "./commands/root";

export { handleError } from "./cli/error";

/**
 * Runs CLI with the given arguments.
 */
export async function run(argv: readonly string[] = args): Promise<void> {
  await parse(rootCmd, argv);
}
