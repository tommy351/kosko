import type { PluginConfig } from "@kosko/config";
import type { Plugin, PluginContext } from "@kosko/plugin";
import { importPath } from "@kosko/require";
import logger, { LogLevel } from "@kosko/log";
import resolveFrom from "resolve-from";
import { CLIError } from "@kosko/cli-utils";
import { type, func, optional, validate } from "superstruct";
import { excludeFalsyInArray } from "../../utils";

type UnknownPluginFactory = (ctx: PluginContext) => unknown;

interface PluginSource {
  name: string;
  path: string;
}

function assertFactory(
  name: string,
  value: unknown
): asserts value is UnknownPluginFactory {
  if (typeof value !== "function") {
    throw new CLIError(`Plugin "${name}" must export a default function`);
  }
}

const pluginSchema = type({
  transformManifest: optional(func()),
  validateManifest: optional(func()),
  validateAllManifests: optional(func())
});

function assertPlugin(name: string, value: unknown): asserts value is Plugin {
  const [err] = validate(value, pluginSchema);
  if (!err) return;

  throw new CLIError(`Invalid plugin "${name}": ${err.message}`);
}

async function loadPlugin({
  name,
  path,
  ...ctx
}: PluginContext & PluginSource): Promise<Plugin> {
  let factory: unknown;

  try {
    const mod = await importPath(path);
    factory = mod.default;
  } catch (err) {
    logger.log(LogLevel.Error, `Failed to load the plugin "${name}"`);
    throw err;
  }

  assertFactory(name, factory);

  let plugin: unknown;

  try {
    plugin = await factory(ctx);
  } catch (err) {
    logger.log(LogLevel.Error, `Failed to construct the plugin "${name}"`);
    throw err;
  }

  assertPlugin(name, plugin);

  return plugin;
}

type MaybePromiseFunc<Args extends unknown[]> = (
  ...args: Args
) => void | Promise<void>;

function composeMaybePromiseFuncs<Args extends unknown[]>(
  fns: readonly MaybePromiseFunc<Args>[]
): MaybePromiseFunc<Args> | undefined {
  if (!fns.length) return;

  return async (...args) => {
    for (const fn of fns) {
      await fn(...args);
    }
  };
}

export function composePlugins(plugins: readonly Plugin[]): Plugin {
  return {
    ...(plugins.some((p) => p.transformManifest) && {
      transformManifest: async ({ data, ...manifest }) => {
        for (const plugin of plugins) {
          if (typeof plugin.transformManifest !== "function") continue;

          data = await plugin.transformManifest({ ...manifest, data });

          // Stop if the return value is undefined or null
          if (data == null) return data;
        }

        return data;
      }
    }),
    validateManifest: composeMaybePromiseFuncs(
      excludeFalsyInArray(plugins.map((p) => p.validateManifest))
    ),
    validateAllManifests: composeMaybePromiseFuncs(
      excludeFalsyInArray(plugins.map((p) => p.validateAllManifests))
    )
  };
}

function resolvePath(cwd: string, name: string): string {
  try {
    return resolveFrom(cwd, name);
  } catch (err) {
    logger.log(
      LogLevel.Error,
      `Failed to resolve path for the plugin "${name}"`
    );
    throw err;
  }
}

export async function loadPlugins(
  cwd: string,
  configs: readonly PluginConfig[]
): Promise<Plugin> {
  if (!configs.length) return {};

  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET !== "node") {
    throw new Error("Plugins are only supported on Node.js");
  }

  const plugins: Plugin[] = [];

  for (const conf of configs) {
    const path = resolvePath(cwd, conf.name);

    logger.log(LogLevel.Debug, `Loading plugin "${conf.name}" from "${path}"`);

    const plugin = await loadPlugin({ ...conf, path, cwd });

    plugins.push(plugin);
  }

  return composePlugins(plugins);
}
