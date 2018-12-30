import { baseOptions, BaseOptions } from "./base";
import { help } from "./cli/help";
import { parse } from "./cli/parse";
import { Command } from "./cli/types";
import { unparse } from "./cli/unparse";
import * as commands from "./commands";

export interface RootArgs {
  command: string;
}

export const rootCmd: Command<BaseOptions> = {
  usage: "kosko <command>",
  description: "kosko generates Kubernetes resources from JavaScript.",
  options: baseOptions,
  args: [
    { name: "command", description: "Command to execute.", required: true }
  ],
  commands,
  exec(ctx, argv) {
    const { args, detail } = parse<BaseOptions, RootArgs>(argv, this, {
      "halt-at-non-option": true
    } as any);

    if (args.command) {
      const cmd = this.commands![args.command];

      if (cmd) {
        return cmd.exec(ctx, unparse(detail).slice(1));
      }
    }

    return help(this);
  }
};
