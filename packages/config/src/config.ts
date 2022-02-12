import toml from "@iarna/toml";
import fs from "fs-extra";
import { join } from "path";
import { Config, EnvironmentConfig } from "./types";
import { validate } from "./validate";
import logger, { LogLevel } from "@kosko/log";

/**
 * Parses and validates a config file from the specified path.
 *
 * @param path Path of the config file.
 */
export async function loadConfig(path: string): Promise<Config> {
  const content = await fs.readFile(path, "utf8");
  const data = await toml.parse.async(content);

  logger.log(LogLevel.Debug, `Found config at "${path}"`);
  return validate(data);
}

/**
 * Searchs config files in the specified directory. Returns an empty object when
 * config files does not exist in the directory.
 *
 * @param cwd Path to the working directory.
 */
export async function searchConfig(
  cwd: string = process.cwd()
): Promise<Config> {
  const path = join(cwd, "kosko.toml");

  try {
    return await loadConfig(path);
  } catch (err: any) {
    if (err.code === "ENOENT") return {};

    logger.log(LogLevel.Debug, "Config load failed", { error: err });
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
