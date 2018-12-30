import { OptionType } from "./cli/types";
import { resolve, isAbsolute } from "path";

export interface BaseOptions {
  cwd?: string;
  help?: boolean;
}

export const baseOptions = {
  cwd: {
    type: OptionType.String,
    description: "Path of working directory.",
    group: "Global Options"
  },
  help: {
    type: OptionType.Boolean,
    description: "Show help.",
    group: "Global Options"
  }
};

export function getCWD<T extends BaseOptions>({ cwd }: T) {
  if (!cwd) return process.cwd();
  return isAbsolute(cwd) ? cwd : resolve(cwd);
}
