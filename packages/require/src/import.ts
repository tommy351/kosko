import { pathToFileURL } from "node:url";

/**
 * Imports a module from the given `path`.
 *
 * @param path - Absolute path to a module. It must not be a file URL or a relative path.
 * @public
 */
export async function importPath(path: string) {
  const url = pathToFileURL(path).toString();

  if (path.endsWith(".json")) {
    return import(url, { assert: { type: "json" } });
  }

  return import(url);
}
