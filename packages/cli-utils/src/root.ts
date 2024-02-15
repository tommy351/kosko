import { isAbsolute, resolve } from "node:path";
// eslint-disable-next-line node/no-missing-import
import yargs from "yargs";
import { cwd } from "node:process";
import { setupLogger } from "./logger";

/**
 * @public
 */
export function createRootCommand(args?: readonly string[]) {
  return yargs(args)
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
    .middleware(setupLogger);
}
