import { parse } from "./cli/command";
import { rootCmd } from "./commands/root";

export { handleError } from "./cli/error";

export async function run(argv: string[] = process.argv.slice(2)) {
  await parse(rootCmd, argv);
}
