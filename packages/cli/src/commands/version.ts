import { Command } from "../cli/types";

export const versionCmd: Command = {
  usage: "kosko version",
  description: "Show version.",
  exec() {
    // tslint:disable-next-line:no-console
    console.log(require("../../package.json").version);
  }
};
