import logger, {
  LogLevel,
  logLevelFromString,
  SilentLogWriter
} from "@kosko/log";
import { RootArguments } from "./command";

export function setupLogger(args: Pick<RootArguments, "silent" | "log-level">) {
  if (args.silent) {
    logger.setWriter(new SilentLogWriter());
  } else {
    const level = args["log-level"];

    logger.setLevel((level && logLevelFromString(level)) || LogLevel.Info);
  }
}
