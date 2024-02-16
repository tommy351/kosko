import type { Manifest, Result } from "@kosko/generate";

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
 * @public
 */
export interface TransformManifest {
  (manifest: Manifest): unknown;
}

/**
 * @public
 */
export interface ValidateManifest {
  (manifest: Manifest): void | Promise<void>;
}

/**
 * @public
 */
export interface ValidateAllManifests {
  (result: Result): void | Promise<void>;
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
  transformManifest?: TransformManifest;

  /**
   * {@inheritDoc @kosko/generate#ResolveOptions.afterValidate}
   */
  validateManifest?: ValidateManifest;

  /**
   * Validate all manifests. This function is called after all manifests are
   * resolved, transformed, and validated.
   */
  validateAllManifests?: ValidateAllManifests;
}
