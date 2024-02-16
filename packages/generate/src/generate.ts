import {
  importPath,
  resolve as resolveModule,
  getRequireExtensions
} from "@kosko/require";
import type { Manifest, Result } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { ResolveOptions, handleResolvePromises, resolve } from "./resolve";
import { GenerateError } from "./error";
import { glob, GlobResult } from "./glob";
import pLimit from "p-limit";
import { validateConcurrency } from "./utils";

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

  /**
   * {@inheritDoc ResolveOptions.concurrency}
   */
  concurrency?: number;

  /**
   * {@inheritdoc ResolveOptions.transform}
   */
  transform?: ResolveOptions["transform"];
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
      concurrency: options.concurrency,
      transform: options.transform,
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

  return {
    manifests: await handleResolvePromises(promises, options.bail)
  };
}
