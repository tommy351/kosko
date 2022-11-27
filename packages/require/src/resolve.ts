import { stat } from "node:fs/promises";
import { join, resolve as resolvePath } from "node:path";
import { cwd } from "node:process";
import { getRequireExtensions } from "./extensions";
import { getErrorCode } from "@kosko/common-utils";

/**
 * @public
 */
export interface ResolveOptions {
  /**
   * The directory to resolve from.
   *
   * @defaultValue `process.cwd()`
   */
  baseDir?: string;

  /**
   * File extensions to resolve.
   *
   * @defaultValue `getRequireExtensions()`
   */
  extensions?: readonly string[];
}

async function fileExists(path: string) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (err) {
    if (getErrorCode(err) === "ENOENT") return false;
    throw err;
  }
}

/**
 * Resolves path to the specified module.
 *
 * @public
 */
export async function resolve(
  id: string,
  options: ResolveOptions = {}
): Promise<string | undefined> {
  // Implementation is based on: https://nodejs.org/api/modules.html#all-together
  const { baseDir = cwd(), extensions = getRequireExtensions() } = options;
  const resolved = resolvePath(baseDir, id);
  const index = join(resolved, "index");

  const possiblePaths = [
    resolved,
    ...extensions.map((ext) => resolved + ext),
    ...extensions.map((ext) => index + ext)
  ];

  for (const path of possiblePaths) {
    if (await fileExists(path)) {
      return path;
    }
  }
}
