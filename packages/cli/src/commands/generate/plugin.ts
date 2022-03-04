import { PluginConfig } from "@kosko/config";
import { Hooks, Plugin, PluginContext } from "@kosko/plugin";
import logger, { LogLevel } from "@kosko/log";
import { localRequireDefault } from "./require";
import { CLIError } from "../../cli/error";

export async function loadPlugins(
  ctx: PluginContext,
  configs: readonly PluginConfig[]
): Promise<Plugin[]> {
  const plugins: Plugin[] = [];

  for (const conf of configs) {
    logger.log(LogLevel.Debug, `Loading plugin "${conf.name}"`);

    const factory = await localRequireDefault(conf.name, ctx.cwd);

    if (typeof factory !== "function") {
      throw new CLIError(`Plugin "${conf.name}" is invalid`, {
        output: `Plugin "${conf.name}" is invalid. Plugin module must export a function.`
      });
    }

    try {
      const plugin = factory(ctx, conf.options);

      plugins.push(plugin);
      logger.log(
        LogLevel.Debug,
        `Plugin "${conf.name}" is loaded successfully`
      );
    } catch (err) {
      logger.log(LogLevel.Error, `Failed to load plugin "${conf.name}"`);
      throw err;
    }
  }

  return plugins;
}

export function composeTransformFunc(
  plugins: readonly Plugin[]
): Hooks["transformManifest"] {
  return async (manifest) => {
    for (const plugin of plugins) {
      const transform = plugin.hooks?.transformManifest;

      if (typeof transform === "function") {
        const transformed = await transform(manifest);

        if (transformed == null) {
          return transformed;
        }

        manifest = transformed;
      }
    }

    return manifest;
  };
}
