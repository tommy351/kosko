import {
  importPath,
  resolve as resolveModule,
  getRequireExtensions
} from "@kosko/require";
import type { Result, Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { resolveAsync } from "./resolve";
import { aggregateErrors, GenerateError } from "./error";
import { glob } from "./glob";

/**
 * @public
 */
export interface AsyncGenerateOptions {
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
   * {@inheritDoc AsyncResolveOptions.validate}
   */
  validate?: boolean;
}

/**
 * @public
 */
export type AsyncGenerateResult =
  | { type: "success"; manifest: Manifest }
  | { type: "error"; error: unknown };

/**
 * @public
 */
export interface GenerateOptions extends AsyncGenerateOptions {
  /**
   * {@inheritDoc ResolveOptions.bail}
   */
  bail?: boolean;
}

async function resolveComponentPath(
  path: string,
  extensions: readonly string[]
) {
  try {
    return await resolveModule(path, { extensions });
  } catch (err) {
    throw new GenerateError("Module path resolve failed", {
      path,
      cause: err
    });
  }
}

async function getComponentValue(path: string): Promise<unknown> {
  try {
    const mod = await importPath(path);
    return mod.default;
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
 * @public
 */
export async function* generateAsync(
  options: AsyncGenerateOptions
): AsyncIterable<AsyncGenerateResult> {
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

      if (!path) {
        logger.log(LogLevel.Debug, "Module not found", {
          data: {
            path: file.absolutePath,
            extensions: extensionsWithDot
          }
        });

        continue;
      }

      yield* resolveAsync(await getComponentValue(path), {
        validate: options.validate,
        index: [],
        path
      });
    } catch (error) {
      yield { type: "error", error };
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
  const { bail, ...opts } = options;
  const manifests: Manifest[] = [];
  const errors: unknown[] = [];

  for await (const result of generateAsync(opts)) {
    if (result.type === "error") {
      if (bail) throw result.error;
      errors.push(result.error);
    } else {
      manifests.push(result.manifest);
    }
  }

  if (errors.length) {
    throw aggregateErrors(errors);
  }

  return { manifests };
}
