import { CLIError } from "@kosko/cli-utils";
import { CommandModule } from "yargs";

export const initCmd: CommandModule = {
  command: "init",
  describe: false,
  handler() {
    throw new CLIError(`"kosko init" command has been removed`, {
      output: `"kosko init" command has been removed from the CLI.

To set up a new project, please use one of the following commands.

- npm create kosko@latest [path]
- yarn create kosko [path]
- pnpm create kosko [path]

For more information, please visit: https://kosko.dev/docs`
    });
  }
};
