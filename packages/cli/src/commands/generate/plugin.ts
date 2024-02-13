import type { PluginConfig } from "@kosko/config";
import type { Plugin, PluginContext } from "@kosko/plugin";
import { importPath } from "@kosko/require";
import logger, { LogLevel } from "@kosko/log";
import resolveFrom from "resolve-from";
import { isRecord } from "@kosko/common-utils";
import { CLIError } from "../../cli/error";
import pc from "picocolors";

type UnknownPluginFactory = (ctx: PluginContext) => unknown;

interface PluginSource {
  name: string;
  path: string;
}

function createError(message: string, cause?: unknown): CLIError {
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
    throw createError(`Plugin "${name}" must export a default function`);
  }
}

function assertPlugin(name: string, value: unknown): asserts value is Plugin {
  if (!isRecord(value)) {
    throw createError(
      `Plugin "${name}" must return an object in the factory function`
    );
  }

  if (
    value.transformManifest != null &&
    typeof value.transformManifest !== "function"
  ) {
    throw createError(
      `Expected "transformManifest" to be a function in plugin "${name}"`
    );
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
    throw createError(`Failed to load plugin "${name}"`, err);
  }

  assertFactory(name, factory);

  let plugin: unknown;

  try {
    plugin = await factory(ctx);
  } catch (err) {
    throw createError(`Failed to construct plugin "${name}"`, err);
  }

  assertPlugin(name, plugin);

  return plugin;
}

function composePlugins(plugins: readonly Plugin[]): Plugin {
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
    })
  };
}

function resolvePath(cwd: string, name: string): string {
  try {
    return resolveFrom(cwd, name);
  } catch (err) {
    throw createError(`Failed to resolve path for plugin "${name}"`, err);
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
