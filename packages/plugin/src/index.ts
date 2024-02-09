import type { ResolveOptions } from "@kosko/generate";

/**
 * Plugin factory.
 *
 * @public
 */
export interface PluginFactory {
  (ctx: PluginContext): Plugin | Promise<Plugin>;
}

/**
 * Plugin context.
 *
 * @public
 */
export interface PluginContext {
  /**
   * Current working directory.
   */
  cwd: string;

  /**
   * Plugin configuration.
   */
  config?: unknown;
}

/**
 * Plugin type.
 *
 * @public
 */
export interface Plugin {
  /**
   * {@inheritDoc @kosko/generate#ResolveOptions.transform}
   */
  transformManifest?: ResolveOptions["transform"];
}
