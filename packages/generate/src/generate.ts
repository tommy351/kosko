import {
  importPath,
  resolve as resolveModule,
  getRequireExtensions
} from "@kosko/require";
import type { Manifest, ManifestToValidate, Result } from "./base";
import logger, { LogLevel } from "@kosko/log";
import {
  ResolveOptions,
  ValidationInterrupt,
  handleResolvePromises,
  reportManifestIssue,
  resolve
} from "./resolve";
import { GenerateError, ResolveError } from "./error";
import { glob, GlobResult } from "./glob";
import pLimit from "p-limit";
import { validateConcurrency } from "./utils";

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
  validateAllManifests?(
    manifests: readonly ManifestToValidate[]
  ): void | Promise<void>;
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
  /* istanbul ignore next */
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "browser") {
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

  async function resolveFile(file: GlobResult): Promise<Manifest[]> {
    logger.log(LogLevel.Debug, `Found component "${file.relativePath}"`);

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

      return [];
    }

    return resolve(await getComponentValue(path), {
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
      await options.validateAllManifests(
        manifests.map((manifest) => ({
          ...manifest,
          report(issue) {
            reportManifestIssue({
              manifest,
              issue,
              bail: options.bail,
              throwOnError: options.throwOnError
            });
          }
        }))
      );
    } catch (err) {
      // Propagate ResolveError and AggregateError
      if (err instanceof ResolveError || err instanceof AggregateError) {
        throw err;
      }

      if (!(err instanceof ValidationInterrupt)) {
        throw new GenerateError(
          "An error occurred in validateAllManifests function",
          { cause: err }
        );
      }
    }
  }

  return { manifests };
}
