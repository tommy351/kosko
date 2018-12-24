import { GlobalArguments, newContext } from "./base";
import { CommandModule, Argv } from "yargs";
import { templates, writeFiles, Template } from "../templates";
import { Context } from "../context";

interface NewArguments extends GlobalArguments {
  template: string;
}

export async function newHandler({ cwd, logger }: Context, args: NewArguments) {
  let template: Template<any>;

  try {
    template = require(args.template);
  } catch (err) {
    template = templates[args.template];
  }

  if (!template) {
    return logger.error(`Template "%s" does not exist`, args.template);
  }

  if (typeof template.validate === "function") {
    await template.validate(args);
  }

  const files = await template.generate(args);

  await writeFiles(cwd, files, {
    afterWritten(path: string) {
      logger.success("File is written", path);
    }
  });
}

export const newCommand: CommandModule = {
  command: "new <template>",
  describe: "Generate components based on templates",
  builder(argv: Argv) {
    return argv.positional("template", {
      describe: "Specify the template",
      type: "string"
    });
  },
  async handler(args: NewArguments) {
    await newHandler(newContext(args), args);
  }
};
