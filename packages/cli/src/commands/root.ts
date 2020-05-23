import { isAbsolute, resolve } from "path";
import yargs from "yargs";
import { wrapCommand } from "../cli/command";
import { generateCmd } from "./generate";
import { initCmd } from "./init";
import { validateCmd } from "./validate";
import { migrateCmd } from "./migrate";

/** @internal */
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
  .option("silent", {
    type: "boolean",
    describe: "Disable log output",
    global: true,
    default: false
  })
  .group(["cwd", "silent", "help", "version"], "Global Options:")
  .command(wrapCommand(initCmd))
  .command(wrapCommand(generateCmd))
  .command(wrapCommand(validateCmd))
  .command(wrapCommand(migrateCmd))
  .demandCommand();
