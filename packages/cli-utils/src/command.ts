import type { Argv } from "yargs";
import { cwd } from "node:process";
import { isAbsolute, resolve } from "node:path";

/**
 * @public
 */
export interface GlobalArguments {
  cwd: string;
  "log-level": string;
  silent: boolean;
}

/**
 * @public
 */
export const globalOptions = {
  cwd: {
    type: "string",
    describe: "Path of working directory",
    global: true,
    default: cwd,
    defaultDescription: "CWD",
    coerce(arg: string) {
      return isAbsolute(arg) ? arg : resolve(arg);
    }
  },
  "log-level": {
    type: "string",
    describe: "Set log level",
    global: true,
    default: "info"
  },
  silent: {
    type: "boolean",
    describe: "Disable log output",
    global: true,
    default: false
  }
} as const;

/**
 * @public
 */
export function parse(input: Argv, argv: readonly string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    input.parse(argv, {}, (err, args, output) => {
      if (output) {
        console.error(output);
      }

      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
