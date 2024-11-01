import { stat } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { cwd } from "node:process";
import { getRequireExtensions } from "./extensions";
import { getErrorCode } from "@kosko/common-utils";
import resolveFrom from "resolve-from";
import { BUILD_TARGET } from "@kosko/build-scripts";

const rRelativePath = /^\.{1,2}[/\\]/;

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
 * This function is implemented based on LOAD_AS_FILE in:
 * https://nodejs.org/api/modules.html#all-together
 */
async function resolveFile(
  path: string,
  extensions: readonly string[]
): Promise<string | undefined> {
  if (await fileExists(path)) {
    return path;
  }

  for (const ext of extensions) {
    const value = path + ext;

    if (await fileExists(value)) {
      return value;
    }
  }
}

/**
 * This function is implemented based on LOAD_INDEX in:
 * https://nodejs.org/api/modules.html#all-together
 */
async function resolveIndex(
  path: string,
  extensions: readonly string[]
): Promise<string | undefined> {
  for (const ext of extensions) {
    const file = join(path, `index${ext}`);

    if (await fileExists(file)) {
      return file;
    }
  }
}

/**
 * Returns full file path of the given path. This function only supports
 * relative or absolute paths of files or directories.
 *
 * @public
 */
export async function resolvePath(
  path: string,
  options: ResolveOptions = {}
): Promise<string | undefined> {
  const { baseDir = cwd(), extensions = getRequireExtensions() } = options;
  const resolved = resolve(baseDir, path);

  return (
    (await resolveFile(resolved, extensions)) ||
    (await resolveIndex(resolved, extensions))
  );
}

function isFilePath(id: string): boolean {
  return isAbsolute(id) || rRelativePath.test(id);
}

/**
 * Returns full file path of the given module id.
 *
 * @param id - A relative or absolute path to a file or directory, or a module name.
 * @public
 */
export async function resolveModule(
  id: string,
  options: Pick<ResolveOptions, "baseDir"> = {}
) {
  if (isFilePath(id)) {
    return resolvePath(id, options);
  }

  if (BUILD_TARGET !== "node") {
    return;
  }

  return resolveFrom.silent(options.baseDir ?? cwd(), id);
}
