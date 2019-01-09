/**
 * Import default from ES modules.
 * @param id module name
 */
export function requireDefault(id: string) {
  const mod = require(id);
  return mod.__esModule ? mod.default : mod;
}
