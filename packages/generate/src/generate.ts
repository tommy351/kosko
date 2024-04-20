import { importPath, resolvePath, getRequireExtensions } from "@kosko/require";
import type { Manifest, Result } from "./base";
import logger, { LogLevel } from "@kosko/log";
import {
  ResolveOptions,
  ReportInterrupt,
  handleResolvePromises,
  resolve,
  createManifest
} from "./resolve";
import { GenerateError, ResolveError } from "./error";
import { glob, GlobResult } from "./glob";
import pLimit from "p-limit";
import { validateConcurrency } from "./utils";
import { BUILD_TARGET } from "@kosko/build-scripts";

/**
 * @public
 */
export interface GenerateOptions
  extends Omit<ResolveOptions, "path" | "index"> {
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
   * Validate all manifests after resolving.
   */
  validateAllManifests?(manifests: readonly Manifest[]): void | Promise<void>;
}

function validateExtensions(
  extensions: readonly string[] = getRequireExtensions().map((ext) =>
    ext.substring(1)
  )
) {
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

  return extensions;
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
 * @throws {@link ResolveError}
 * Propagated from {@link resolve} function.
 *
 * @throws AggregateError
 * Thrown if multiple errors occurred.
 *
 * @public
 * @see {@link resolve}
 */
export async function generate(options: GenerateOptions): Promise<Result> {
  if (BUILD_TARGET === "browser") {
    throw new Error("generate is only supported on Node.js");
  }

  if (!options.components.length) {
    throw new GenerateError("components must not be empty");
  }

  const concurrency = validateConcurrency(options.concurrency);
  const extensions = validateExtensions(options.extensions);
  const extensionsWithDot = extensions.map((ext) => "." + ext);
  const promises: Promise<Manifest[]>[] = [];
  const limit = pLimit(concurrency);

  function reportResolveError({
    path,
    message,
    cause
  }: {
    path: string;
    message: string;
    cause: unknown;
  }): Manifest[] {
    const manifest = createManifest({
      position: { path, index: [] },
      data: undefined,
      bail: options.bail,
      throwOnError: options.throwOnError
    });

    manifest.report({
      severity: "error",
      message,
      cause
    });

    return [manifest];
  }

  async function resolveFile(file: GlobResult): Promise<Manifest[]> {
    logger.log(LogLevel.Debug, `Found component "${file.relativePath}"`);

    let path: string | undefined;

    try {
      path = await resolvePath(file.absolutePath, {
        extensions: extensionsWithDot
      });
    } catch (err) {
      return reportResolveError({
        path: file.absolutePath,
        message: "Module path resolve failed",
        cause: err
      });
    }

    if (!path) {
      logger.log(LogLevel.Debug, "Module not found", {
        data: {
          path: file.absolutePath,
          extensions: extensionsWithDot
        }
      });

      return [];
    }

    let value: unknown;

    try {
      const mod = await importPath(path);
      value = mod.default;
    } catch (err) {
      return reportResolveError({
        path,
        message: "Component value resolve failed",
        cause: err
      });
    }

    return resolve(value, {
      validate: options.validate,
      bail: options.bail,
      concurrency,
      transform: options.transform,
      throwOnError: options.throwOnError,
      validateManifest: options.validateManifest,
      keepAjvErrors: options.keepAjvErrors,
      index: [],
      path
    });
  }

  for await (const file of glob({
    path: options.path,
    extensions,
    patterns: options.components
  })) {
    promises.push(limit(() => resolveFile(file)));
  }

  const manifests = await handleResolvePromises(promises, options.bail);
  const validateEnabled = options.validate ?? true;

  if (validateEnabled && typeof options.validateAllManifests === "function") {
    logger.log(LogLevel.Debug, "Validating all manifests");

    try {
      await options.validateAllManifests(manifests);
    } catch (err) {
      // Propagate ResolveError
      if (err instanceof ResolveError) {
        throw err;
      }

      if (!(err instanceof ReportInterrupt)) {
        throw new GenerateError(
          "An error occurred in validateAllManifests function",
          { cause: err }
        );
      }
    }
  }

  return { manifests };
}
