export interface PluginFactory<T = unknown> {
  (ctx: PluginContext, options: T): Plugin;
}

export interface PluginContext {
  cwd: string;
}

export interface Hooks {
  /**
   * Transform a manifest. Return `null` or `undefined` to omit manifests. This
   * function is executed before validation.
   */
  transformManifest?(data: unknown): unknown;
}

export interface Plugin {
  hooks?: Hooks;
}
