import logger, {
  LogLevel,
  logLevelFromString,
  SilentLogWriter
} from "@kosko/log";
import type { GlobalArguments } from "./command";

/**
 * @public
 */
export function setupLogger(
  args: Pick<GlobalArguments, "silent" | "log-level">
) {
  if (args.silent) {
    logger.setWriter(new SilentLogWriter());
  } else {
    const level = args["log-level"];

    logger.setLevel((level && logLevelFromString(level)) || LogLevel.Info);
  }
}
