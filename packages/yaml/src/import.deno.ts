import { createRequire } from "node:module";

/**
 * Use `createRequire` instead of `import` because Deno throws:
 *
 * ```
 * TypeError: Loading unprepared module
 * ```
 *
 * when importing modules using a dynamic specifier. For example:
 *
 * ```ts
 * import(`kubernetes-models/${apiVersion}/${kind}`);
 * ```
 */
const require = createRequire(import.meta.url);

export async function importModule(id: string) {
  return require(id);
}
