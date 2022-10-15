import { isAbsolute, resolve } from "node:path";
import yargs from "yargs";
import { generateCmd } from "./generate/command";
import { initCmd } from "./init/command";
import { validateCmd } from "./validate";
import { migrateCmd } from "./migrate";
import logger, {
  LogLevel,
  logLevelFromString,
  SilentLogWriter
} from "@kosko/log";

export const rootCmd = yargs
  .scriptName("kosko")
  .exitProcess(false)
  .option("cwd", {
    type: "string",
    describe: "Path of working directory",
    global: true,
    default: process.cwd(),
    defaultDescription: "CWD",
    coerce(arg) {
      return isAbsolute(arg) ? arg : resolve(arg);
    }
  })
  .option("log-level", {
    type: "string",
    describe: "Set log level",
    global: true,
    default: "info"
  })
  .option("silent", {
    type: "boolean",
    describe: "Disable log output",
    global: true,
    default: false
  })
  .group(["cwd", "log-level", "silent", "help", "version"], "Global Options:")
  .middleware((args) => {
    if (args.silent) {
      logger.setWriter(new SilentLogWriter());
    } else {
      const level = args["log-level"];

      logger.setLevel((level && logLevelFromString(level)) || LogLevel.Info);
    }
  })
  .command(initCmd)
  .command(generateCmd)
  .command(validateCmd)
  .command(migrateCmd)
  .demandCommand();
