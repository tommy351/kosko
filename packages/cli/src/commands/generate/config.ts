import { getConfig, searchConfig } from "@kosko/config";
import { CLIError } from "../../cli/error";
import { BaseGenerateArguments } from "./types";

export async function loadConfig(args: BaseGenerateArguments) {
  const base = await searchConfig(args.cwd);
  const {
    components = [],
    require = [],
    loaders = []
  } = args.env ? getConfig(base, args.env) : base;
  const config = {
    ...base,
    components:
      args.components && args.components.length ? args.components : components,
    require: [...require, ...(args.require || [])],
    loaders: [...loaders, ...(args.loader || [])]
  };

  if (!config.components.length) {
    throw new CLIError("No components are given", {
      output:
        "No components are given. Set components in a config file or in arguments."
    });
  }

  return config;
}
