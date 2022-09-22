import { Command } from "../cli/command";
import logger, { LogLevel } from "@kosko/log";
import { handler } from "./generate/worker";
import { BaseGenerateArguments } from "./generate/types";
import { generateBuilder } from "./generate/command";
import { loadConfig } from "./generate/config";

export type ValidateArguments = BaseGenerateArguments;

export const validateCmd: Command<ValidateArguments> = {
  command: "validate [components..]",
  describe: "Validate components",
  builder(argv) {
    /* istanbul ignore next */
    return generateBuilder(argv)
      .example("$0 validate", "Validate components")
      .example("$0 validate foo bar", "Specify components")
      .example("$0 validate foo_*", "Use glob syntax");
  },
  async handler(args) {
    const config = await loadConfig(args);

    await handler({
      args: { ...args, validate: true },
      config
    });

    logger.log(LogLevel.Info, "Components are valid");
  }
};
