import toml from "@iarna/toml";
import fs from "node:fs/promises";
import { join } from "node:path";
import { Config, EnvironmentConfig } from "./types";
import { validate } from "./validate";
import logger, { LogLevel } from "@kosko/log";
import { getErrorCode, toArray } from "@kosko/utils";

/**
 * Parses and validates a config file from the specified path.
 *
 * @param path - Path of the config file.
 * @public
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
 * @param cwd - Path to the working directory.
 * @public
 */
export async function searchConfig(
  cwd: string = process.cwd()
): Promise<Config> {
  const path = join(cwd, "kosko.toml");

  try {
    return await loadConfig(path);
  } catch (err) {
    if (getErrorCode(err) === "ENOENT") return {};

    logger.log(LogLevel.Debug, "Config load failed", { error: err });
    throw err;
  }
}

function flatten<T>(...arrays: (readonly T[] | undefined)[]): T[] {
  return arrays.reduce((acc = [], item = []) => acc.concat(item), []) as T[];
}

/**
 * Returns environment configs merged with global configs.
 *
 * @param config - Config object.
 * @param envs - Environment name.
 * @public
 */
export function getConfig(
  config: Config,
  envs: string | string[]
): Required<EnvironmentConfig> {
  const { environments = {} } = config;
  const envConfigs = toArray(envs)
    .map((env) => environments[env])
    .filter(Boolean);

  if (!envConfigs.length) {
    return {
      require: config.require ?? [],
      components: config.components ?? [],
      loaders: config.loaders ?? []
    };
  }

  return {
    require: flatten(config.require, ...envConfigs.map((e) => e.require)),
    components: flatten(
      config.components,
      ...envConfigs.map((e) => e.components)
    ),
    loaders: flatten(config.loaders, ...envConfigs.map((e) => e.loaders))
  };
}
