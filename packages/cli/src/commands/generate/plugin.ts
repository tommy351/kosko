import type { PluginConfig } from "@kosko/config";
import type { Plugin, PluginContext } from "@kosko/plugin";
import { importPath } from "@kosko/require";
import logger, { LogLevel } from "@kosko/log";
import resolveFrom from "resolve-from";
import { isRecord } from "@kosko/common-utils";
import { CLIError } from "@kosko/cli-utils";
import pc from "picocolors";
import { type, func, optional, validate } from "superstruct";

type UnknownPluginFactory = (ctx: PluginContext) => unknown;

const pluginSchema = type({
  transformManifest: optional(func()),
  validateManifest: optional(func()),
  validateAllManifests: optional(func())
});

interface PluginSource {
  name: string;
  path: string;
}

function wrapError(cause: unknown, message: string): CLIError {
  let output = message;

  if (isRecord(cause) && typeof cause.stack === "string") {
    output += `\n${pc.gray(cause.stack)}`;
  }

  return new CLIError(message, { output });
}

function assertFactory(
  name: string,
  value: unknown
): asserts value is UnknownPluginFactory {
  if (typeof value !== "function") {
    throw new CLIError(`Plugin "${name}" must export a default function`);
  }
}

function assertPlugin(name: string, value: unknown): asserts value is Plugin {
  const [err] = validate(value, pluginSchema);

  if (err) {
    throw new CLIError(`Plugin "${name}" is invalid: ${err.message}`);
  }
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
    throw wrapError(err, `Failed to load plugin "${name}"`);
  }

  assertFactory(name, factory);

  let plugin: unknown;

  try {
    plugin = await factory(ctx);
  } catch (err) {
    throw wrapError(err, `Failed to construct plugin "${name}"`);
  }

  assertPlugin(name, plugin);

  return plugin;
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
    ...(plugins.some((p) => p.validateManifest) && {
      validateManifest: async (manifest) => {
        for (const plugin of plugins) {
          if (typeof plugin.validateManifest !== "function") continue;

          await plugin.validateManifest(manifest);
        }
      }
    }),
    ...(plugins.some((p) => p.validateAllManifests) && {
      validateAllManifests: async (manifests) => {
        for (const plugin of plugins) {
          if (typeof plugin.validateAllManifests !== "function") continue;

          await plugin.validateAllManifests(manifests);
        }
      }
    })
  };
}

function resolvePath(cwd: string, name: string): string {
  try {
    return resolveFrom(cwd, name);
  } catch (err) {
    throw wrapError(err, `Failed to resolve path for plugin "${name}"`);
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
