import {
  importPath,
  resolve as resolveModule,
  getRequireExtensions
} from "@kosko/require";
import { Result, Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { resolve } from "./resolve";
import { aggregateErrors, GenerateError } from "./error";
import { glob } from "./glob";

/**
 * @public
 */
export interface GenerateOptions {
  /**
   * Path of the component folder.
   */
  path: string;

  /**
   * Patterns of component names.
   *
   * @example ["*"]
   */
  components: readonly string[];

  /**
   * File extensions of components.
   *
   * @example ["js", "json"]
   */
  extensions?: readonly string[];

  /**
   * See {@link ResolveOptions.validate} for more info.
   */
  validate?: boolean;

  /**
   * See {@link ResolveOptions.bail} for more info.
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
    const { default: mod } = await importPath(path);

    return mod;
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
 * Extension names is optional in `options.components` because it's appended
 * automatically. (e.g. `foo` =\> `foo?(.{js,json})`)
 *
 * Extensions are from `require.extensions`. You can require `ts-node/register`
 * to add support for `.ts` extension.
 *
 * @public
 */
export async function generate(options: GenerateOptions): Promise<Result> {
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
