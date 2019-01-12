import cosmiconfig, { CosmiconfigResult } from "cosmiconfig";
import Debug from "debug";
import { Config, EnvironmentConfig } from "./types";
import { validate } from "./validate";

const explorer = cosmiconfig("kosko");
const debug = Debug("kosko:config");

function validateResult(result: CosmiconfigResult): Config {
  if (!result) return {};

  const { filepath, config } = result;

  debug("Found config at", filepath);

  if (!config) return {};

  validate(config);
  return config;
}

export async function loadConfig(path: string): Promise<Config> {
  return validateResult(await explorer.load(path));
}

export async function searchConfig(cwd?: string): Promise<Config> {
  return validateResult(await explorer.search(cwd));
}

function flatten<T>(...arrays: Array<ReadonlyArray<T> | undefined>): T[] {
  return arrays.reduce((acc = [], item = []) => acc.concat(item), []) as T[];
}

export function getConfig(config: Config, env: string): EnvironmentConfig {
  const { environments = {} } = config;
  const envConfig = environments[env] || {};

  return {
    require: flatten(config.require, envConfig.require),
    components: flatten(config.components, envConfig.components)
  };
}
