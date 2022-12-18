import { isAbsolute, resolve } from "node:path";
import yargs from "yargs";
import { generateCmd } from "./generate/command";
import { initCmd } from "./init/command";
import { validateCmd } from "./validate";
import { migrateCmd } from "./migrate";
import { setupLogger } from "../cli/logger";
import { cwd } from "node:process";
import { version } from "../../package.json";

export function createRootCommand(args: readonly string[]) {
  return yargs(args)
    .scriptName("kosko")
    .version(version)
    .exitProcess(false)
    .option("cwd", {
      type: "string",
      describe: "Path of working directory",
      global: true,
      default: cwd(),
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
    .middleware(setupLogger)
    .command(initCmd)
    .command(generateCmd)
    .command(validateCmd)
    .command(migrateCmd)
    .demandCommand();
}
