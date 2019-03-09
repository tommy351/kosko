/**
 * Import default from ES modules.
 * @param id module name
 */
export function requireDefault(id: string): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(id);
  return mod.__esModule ? mod.default : mod;
}
