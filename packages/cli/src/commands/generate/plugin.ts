import type { PluginConfig } from "@kosko/config";
import type { Plugin, PluginContext } from "@kosko/plugin";
import { importPath, resolveModule } from "@kosko/require";
import logger, { LogLevel } from "@kosko/log";
import { getManifestMeta, isRecord } from "@kosko/common-utils";
import { CLIError } from "@kosko/cli-utils";
import pc from "picocolors";
import { type, func, optional, validate } from "superstruct";
import { BUILD_TARGET } from "@kosko/build-scripts";

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
      transformManifest: async ({ data, metadata, ...manifest }) => {
        for (const plugin of plugins) {
          if (typeof plugin.transformManifest !== "function") continue;

          data = await plugin.transformManifest({
            ...manifest,
            data,
            metadata
          });

          // Stop if the return value is undefined or null
          if (data == null) return data;

          metadata = getManifestMeta(data);
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

export async function loadPlugins(
  cwd: string,
  configs: readonly PluginConfig[]
): Promise<Plugin> {
  if (!configs.length) return {};

  if (BUILD_TARGET !== "node") {
    throw new Error("Plugins are only supported on Node.js");
  }

  const plugins: Plugin[] = [];

  for (const conf of configs) {
    const path = await resolveModule(conf.name, { baseDir: cwd });

    if (!path) {
      throw new Error(`Failed to resolve path for plugin "${conf.name}"`);
    }

    logger.log(LogLevel.Debug, `Loading plugin "${conf.name}" from "${path}"`);

    const plugin = await loadPlugin({ ...conf, path, cwd });

    plugins.push(plugin);
  }

  return composePlugins(plugins);
}
