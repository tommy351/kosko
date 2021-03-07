import { importPath, resolve, getRequireExtensions } from "@kosko/require";
import Debug from "debug";
import glob from "fast-glob";
import { join } from "path";
import { Result, Manifest } from "./base";
import { ValidationError } from "./error";

const debug = Debug("kosko:generate");

export interface GenerateOptions {
  /**
   * Path of the component folder.
   */
  path: string;

  /**
   * Patterns of component names.
   */
  components: readonly string[];

  /**
   * File extensions of components.
   */
  extensions?: readonly string[];

  /**
   * Validate components.
   */
  validate?: boolean;
}

async function getComponentValue(id: string): Promise<unknown> {
  const { default: mod } = await importPath(id);

  if (typeof mod === "function") {
    return await mod();
  }

  return mod;
}

async function resolveComponent(
  value: unknown,
  options: {
    validate?: boolean;
    index: number[];
    path: string;
  }
): Promise<ReadonlyArray<Manifest>> {
  if (typeof value === "function") {
    return resolveComponent(await value(), options);
  }

  if (Array.isArray(value)) {
    const manifests: Manifest[] = [];

    for (let i = 0; i < value.length; i++) {
      const result = await resolveComponent(value[i], {
        validate: options.validate,
        index: [...options.index, i],
        path: options.path
      });

      manifests.push(...result);
    }

    return manifests;
  }

  if (options.validate) {
    if (typeof (value as any).validate === "function") {
      try {
        debug(
          "Validating manifest %s in %s",
          options.index.join("."),
          options.path
        );
        await (value as any).validate();
      } catch (err) {
        throw new ValidationError({
          path: options.path,
          index: options.index,
          cause: err,
          component: value
        });
      }
    }
  }

  const manifest: Manifest = {
    path: options.path,
    index: options.index,
    data: value
  };

  return [manifest];
}

/**
 * Finds components with glob patterns in the specified path and returns exported values
 * from each components.
 *
 * Extension names is optional in `options.components` because it's appended
 * automatically. (e.g. `foo` => `foo?(.{js,json})`)
 *
 * Extensions are from `require.extensions`. You can require `ts-node/register`
 * to add support for `.ts` extension.
 *
 * A component can export:
 *  - Object
 *  - Array
 *  - Function
 *  - Async function.
 *
 * @param options
 */
export async function generate(options: GenerateOptions): Promise<Result> {
  const extensions =
    options.extensions || getRequireExtensions().map((ext) => ext.substring(1));
  const suffix = `?(.{${extensions.join(",")}})`;
  const patterns = options.components.map((x) => x + suffix);
  debug("Component patterns", patterns);

  const ids = await glob(patterns, {
    cwd: options.path,
    onlyFiles: false
  });
  debug("Found components", ids);

  const manifests: Manifest[] = [];

  for (const id of ids) {
    const fullId = join(options.path, id);
    const path = await resolve(fullId, {
      extensions: extensions.map((ext) => `.${ext}`)
    });

    if (!path) {
      throw new Error(`Cannot resolve module "${fullId}"`);
    }

    const components = await resolveComponent(await getComponentValue(path), {
      validate: options.validate,
      index: [],
      path
    });

    manifests.push(...components);
  }

  return { manifests };
}
