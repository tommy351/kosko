// @ts-check

/**
 * @type {import('./index').resolve}
 */
export function resolve(id, { base } = {}) {
  return import.meta.resolve(id, base);
}

/**
 * @type {import('./index').requireModule}
 */
export function requireModule(id) {
  return import(id);
}

/**
 * @type {import('./index').requireDefault}
 */
export async function requireDefault(id) {
  const mod = await import(id);
  return mod.default;
}

/**
 * @type {import('./index').requireNamedExport}
 */
export async function requireNamedExport(id, name) {
  const mod = await import(id);
  return mod[name];
}

/**
 * @type {import('./index').getModuleExtensions}
 */
export function getModuleExtensions() {
  return ["cjs", "mjs", "js"];
}
