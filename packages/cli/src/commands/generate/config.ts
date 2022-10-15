import {
  getConfig,
  searchConfig,
  loadConfig as loadConfigFile
} from "@kosko/config";
import { resolve } from "node:path";
import { CLIError } from "../../cli/error";
import { BaseGenerateArguments } from "./types";

export async function loadConfig(args: BaseGenerateArguments) {
  const base = args.config
    ? await loadConfigFile(resolve(args.cwd, args.config))
    : await searchConfig(args.cwd);
  const envs = [base.baseEnvironment, args.env].filter(
    (env): env is string => typeof env === "string"
  );
  const { components, require, loaders } = getConfig(base, envs);
  const config = {
    ...base,
    components: args.components?.length ? args.components : components,
    require: [...require, ...(args.require || [])],
    loaders: [...loaders, ...(args.loader || [])],
    bail: args.bail ?? base.bail
  };

  if (!config.components.length) {
    throw new CLIError("No components are given", {
      output:
        "No components are given. Set components in a config file or in arguments."
    });
  }

  return config;
}
