import type { PluginConfig } from "@kosko/config";
import type { Plugin, PluginContext } from "@kosko/plugin";
import { importPath } from "@kosko/require";
import logger, { LogLevel } from "@kosko/log";
import resolveFrom from "resolve-from";
import { excludeFalsyInArray } from "../../utils";

type UnknownPluginFactory = (ctx: PluginContext) => unknown;

class PluginLoadError extends Error {
  public readonly name = "PluginLoadError";
}

function assertPluginFactory(
  name: string,
  value: unknown
): asserts value is UnknownPluginFactory {
  if (typeof value !== "function") {
    throw new PluginLoadError(
      `Plugin "${name}" must export a default function`
    );
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function assertPlugin(name: string, value: unknown): asserts value is Plugin {
  if (!isObject(value)) {
    throw new PluginLoadError(
      `Plugin "${name}" must return an object in the factory function`
    );
  }

  if (
    value.transformManifest != null &&
    typeof value.transformManifest !== "function"
  ) {
    throw new PluginLoadError(
      `Expected "transformManifest" to be a function in plugin "${name}"`
    );
  }
}

async function loadPlugin({
  name,
  path,
  ...ctx
}: PluginContext & { name: string; path: string }): Promise<Plugin> {
  const { default: mod } = await importPath(path);
  assertPluginFactory(name, mod);

  const plugin = await mod(ctx);
  assertPlugin(name, plugin);

  return plugin;
}

function composeTransforms(
  transformers: readonly Required<Plugin>["transformManifest"][]
): Plugin["transformManifest"] {
  return async (manifest) => {
    let data = manifest.data;

    for (const transform of transformers) {
      data = await transform({ ...manifest, data });

      // Stop if the return value is undefined or null
      if (data == null) return data;
    }

    return data;
  };
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
    const path = resolveFrom(cwd, conf.name);

    logger.log(LogLevel.Debug, `Loading plugin "${conf.name}" from "${path}"`);

    const plugin = await loadPlugin({ ...conf, path, cwd });

    plugins.push(plugin);
  }

  const transformers = excludeFalsyInArray(
    plugins.map((p) => p.transformManifest)
  );

  return {
    transformManifest: composeTransforms(transformers)
  };
}
