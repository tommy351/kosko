export interface ResolveOptions {
  /**
   * The absolute path to resolve from. If none is specified, the following
   * values are used as default.
   *
   * - CommonJS: `__filename`
   * - ES modules: `import.meta.url`
   */
  base?: string;
}

/**
 * Resolves path to the specified module.
 */
export function resolve(
  id: string,
  options?: ResolveOptions
): Promise<string | undefined>;

/**
 * Imports a module from the specified path. Returns a `Promise` when used as a
 * ES module.
 */
export function requireModule(id: string): unknown;

/**
 * Imports the default export from the specified path. See `requireModule`
 * for more info.
 */
export function requireDefault(id: string): unknown;

/**
 * Import a named export from the specified path. See`requireModule` for more
 * info.
 */
export function requireNamedExport(id: string, name: string): unknown;
