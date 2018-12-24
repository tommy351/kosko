import { Arguments, Options } from "yargs";
import { Context } from "../context";
import { newLogger } from "../utils/log";

export interface GlobalArguments extends Arguments {
  cwd?: string;
  verbose?: boolean;
}

export const globalOptions: { [key: string]: Options } = {
  cwd: {
    type: "string",
    describe: "Specify the working directory"
  },
  verbose: {
    type: "boolean",
    describe: "Show more logs"
  }
};

export function newContext<T extends GlobalArguments>(args: T): Context {
  return {
    cwd: args.cwd || process.cwd(),
    logger: newLogger(args)
  };
}
