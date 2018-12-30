import { rootCmd } from "./root";
import { Logger } from "./cli/logger";

export { handleError } from "./cli/error";

export async function run(argv: string[] = process.argv.slice(2)) {
  const logger = new Logger(process.stderr);
  return rootCmd.exec({ logger }, argv);
}
