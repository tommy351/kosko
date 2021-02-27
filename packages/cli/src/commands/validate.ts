import { Command, getLogger } from "../cli/command";
import {
  BaseGenerateArguments,
  generateBuilder,
  generateHandler
} from "./generate";

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
    const logger = getLogger(args);
    await generateHandler({ ...args, validate: true });
    logger.success("Components are valid");
  }
};
