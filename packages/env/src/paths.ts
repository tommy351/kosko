const rTemplate = /#\{(\w+)\}/g;

/**
 * Path patterns of environment files.
 *
 * @remarks
 * Following tokens can be used in path patterns.
 *
 * - `#{environment}` - Environment name.
 *
 * - `#{component}` - Component name.
 *
 * @public
 */
export interface Paths {
  /**
   * Path pattern of global environment files.
   *
   * @defaultValue `environments/#{environment}`
   */
  global: string;

  /**
   * Path pattern of component environment files.
   *
   * @defaultValue `environments/#{environment}/#{component}`
   */
  component: string;
}

export function formatPath(path: string, data: Record<string, string>): string {
  return path.replace(rTemplate, (s, key) => {
    return data[key] || s;
  });
}
