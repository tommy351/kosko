import { CLIError, Command, RootArguments } from "@kosko/cli-utils";

export const initCmd: Command<RootArguments> = {
  command: "init",
  describe: false,
  handler() {
    throw new CLIError(`"kosko init" command has been removed`, {
      output: `"kosko init" command has been removed from the CLI.

To set up a new project, please use one of the following commands.

- npm init kosko [path]
- yarn create kosko [path]
- pnpm create kosko [path]
- npx create-kosko [path]

For more information, please visit: https://kosko.dev/docs`
    });
  }
};
