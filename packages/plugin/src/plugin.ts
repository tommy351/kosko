import type { Manifest, ManifestToValidate } from "@kosko/generate";

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
  (manifest: ManifestToValidate): void | Promise<void>;
}

/**
 * @public
 */
export interface ValidateAllManifests {
  (manifests: readonly ManifestToValidate[]): void | Promise<void>;
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
   * {@inheritDoc @kosko/generate#ResolveOptions.validateManifest}
   */
  validateManifest?: ValidateManifest;

  /**
   * {@inheritDoc @kosko/generate#GenerateOptions.validateAllManifests}
   */
  validateAllManifests?: ValidateAllManifests;
}
