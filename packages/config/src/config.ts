import toml from "@iarna/toml";
import Debug from "debug";
import {
  readFile,
  joinPath,
  cwd as getCWD,
  NotFoundError
} from "@kosko/system-utils";
import { Config, EnvironmentConfig } from "./types";
import { validate } from "./validate";

const debug = Debug("kosko:config");

/**
 * Parses and validates a config file from the specified path.
 *
 * @param path Path of the config file.
 */
export async function loadConfig(path: string): Promise<Config> {
  const content = await readFile(path);
  const data = toml.parse(content);

  debug("Found config at", path);
  return validate(data);
}

/**
 * Searchs config files in the specified directory. Returns an empty object when
 * config files does not exist in the directory.
 *
 * @param cwd Path to the working directory.
 */
export async function searchConfig(cwd: string = getCWD()): Promise<Config> {
  const path = joinPath(cwd, "kosko.toml");

  try {
    return await loadConfig(path);
  } catch (err) {
    if (err instanceof NotFoundError) return {};

    debug("Config load failed", err);
    throw err;
  }
}

function flatten<T>(...arrays: (ReadonlyArray<T> | undefined)[]): T[] {
  return arrays.reduce((acc = [], item = []) => acc.concat(item), []) as T[];
}

/**
 * Returns environment configs merged with global configs.
 *
 * @param config Config object.
 * @param env Environment name.
 */
export function getConfig(
  config: Config,
  env: string
): Required<EnvironmentConfig> {
  const { environments = {} } = config;
  const envConfig = environments[env] || {};

  return {
    require: flatten(config.require, envConfig.require),
    components: flatten(config.components, envConfig.components)
  };
}
