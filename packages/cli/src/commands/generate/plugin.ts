import type { PluginConfig } from "@kosko/config";
import type { Plugin, PluginContext } from "@kosko/plugin";
import { importPath } from "@kosko/require";
import resolveFrom from "resolve-from";
import { excludeFalsyInArray } from "../../utils";

async function loadPlugin({
  name,
  path,
  ...ctx
}: PluginContext & { name: string; path: string }): Promise<Plugin> {
  const mod = await importPath(path);
  const plugin = await mod(ctx);

  if (typeof plugin !== "object" || plugin == null) {
    throw new Error(`Plugin "${name}" must export an object`);
  }

  if (
    plugin.transformManifest != null &&
    typeof plugin.transformManifest !== "function"
  ) {
    throw new Error(
      `Expected "transformManifest" to be a function in plugin "${name}"`
    );
  }

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
