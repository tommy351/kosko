import { resolve as resolveModule, getRequireExtensions } from "@kosko/require";
import type { Result, Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { resolve } from "./resolve";
import { aggregateErrors, GenerateError } from "./error";
import { glob } from "./glob";
import { pathToFileURL } from "node:url";
import { getErrorCode } from "@kosko/common-utils";

/**
 * @public
 */
export interface GenerateOptions {
  /**
   * Path of the component folder.
   */
  path: string;

  /**
   * Glob patterns of component names.
   *
   * @example
   * ```js
   * ["*"]
   * ```
   *
   * @see {@link https://en.wikipedia.org/wiki/Glob_(programming) | glob pattern}
   */
  components: readonly string[];

  /**
   * File extensions of components.
   *
   * @example
   * ```js
   * ["js", "json"]
   * ```
   */
  extensions?: readonly string[];

  /**
   * {@inheritDoc ResolveOptions.validate}
   */
  validate?: boolean;

  /**
   * {@inheritDoc ResolveOptions.bail}
   */
  bail?: boolean;
}

async function resolveComponentPath(
  path: string,
  extensions: readonly string[]
) {
  let result: string | undefined;

  try {
    result = await resolveModule(path, { extensions });
  } catch (err) {
    throw new GenerateError("Module path resolve failed", {
      path,
      cause: err
    });
  }

  if (!result) {
    throw new GenerateError("Module not found", {
      path
    });
  }

  return result;
}

async function importDefault(path: string) {
  const mod = await import(path);
  return mod.default;
}

async function importPath(path: string) {
  const url = pathToFileURL(path).toString();

  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET !== "node") return importDefault(url);

  try {
    return await importDefault(url);
  } catch (err) {
    if (getErrorCode(err) !== "ERR_UNKNOWN_FILE_EXTENSION") {
      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path);
  return mod && mod.__esModule ? mod.default : mod;
}

async function getComponentValue(path: string): Promise<unknown> {
  try {
    return await importPath(path);
  } catch (err) {
    throw new GenerateError("Component value resolve failed", {
      path,
      cause: err
    });
  }
}

function validateExtensions(extensions: readonly string[]) {
  if (!extensions.length) {
    throw new GenerateError("extensions must not be empty");
  }

  for (const ext of extensions) {
    if (ext.startsWith(".")) {
      throw new GenerateError(
        `extension must not be started with ".": "${ext}"`
      );
    }
  }
}

/**
 * Finds components with glob patterns in the specified path and returns exported
 * values from each components.
 *
 * @remarks
 * Extension names is optional in `options.components` because it's appended
 * automatically. (e.g. `foo` =\> `foo?(.{js,json})`)
 *
 * Extensions are from `require.extensions`. You can require `ts-node/register`
 * to add support for `.ts` extension.
 *
 * Note that this function currently is only available on Node.js.
 *
 * @throws {@link GenerateError}
 * Thrown if an error occurred.
 *
 * @throws {@link @kosko/aggregate-error#AggregateError}
 * Thrown if multiple errors occurred.
 *
 * @public
 * @see {@link resolve}
 */
export async function generate(options: GenerateOptions): Promise<Result> {
  /* istanbul ignore next */
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "browser") {
    throw new Error("generate is only supported on Node.js and Deno");
  }

  if (!options.components.length) {
    throw new GenerateError("components must not be empty");
  }

  const extensions =
    options.extensions || getRequireExtensions().map((ext) => ext.substring(1));
  validateExtensions(extensions);

  const extensionsWithDot = extensions.map((ext) => "." + ext);
  const manifests: Manifest[] = [];
  const errors: unknown[] = [];

  for await (const file of glob({
    path: options.path,
    extensions,
    patterns: options.components
  })) {
    logger.log(LogLevel.Debug, `Found component "${file.relativePath}"`);

    try {
      const path = await resolveComponentPath(
        file.absolutePath,
        extensionsWithDot
      );
      const components = await resolve(await getComponentValue(path), {
        validate: options.validate,
        bail: options.bail,
        index: [],
        path
      });

      manifests.push(...components);
    } catch (err) {
      if (options.bail) {
        throw err;
      }

      errors.push(err);
    }
  }

  if (errors.length) {
    throw aggregateErrors(errors);
  }

  return { manifests };
}
