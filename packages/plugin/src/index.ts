import type { Manifest } from "@kosko/generate";

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
   * Transform a manifest. This function is called when a new manifest is
   * resolved, and before validation. The return value will override the
   * data of the manifest. If the return value is `undefined` or `null`, the
   * manifest will be removed from the result.
   */
  transformManifest?(manifest: Manifest): unknown | Promise<unknown>;
}
