import {
  importPath,
  resolve as resolveModule,
  getRequireExtensions
} from "@kosko/require";
import glob from "fast-glob";
import { join } from "path";
import { Result, Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { resolve } from "./resolve";

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

  return mod;
}

/**
 * Finds components with glob patterns in the specified path and returns exported
 * values from each components.
 *
 * Extension names is optional in `options.components` because it's appended
 * automatically. (e.g. `foo` => `foo?(.{js,json})`)
 *
 * Extensions are from `require.extensions`. You can require `ts-node/register`
 * to add support for `.ts` extension.
 */
export async function generate(options: GenerateOptions): Promise<Result> {
  const manifests: Manifest[] = [];

  for await (const manifest of generateAsync(options)) {
    manifests.push(manifest);
  }

  return { manifests };
}

/**
 * This is function is same as `generate`, but returns an `AsyncIterable`
 * instead.
 */
export async function* generateAsync(
  options: GenerateOptions
): AsyncIterable<Manifest> {
  const extensions =
    options.extensions || getRequireExtensions().map((ext) => ext.substring(1));
  const suffix = `?(.{${extensions.join(",")}})`;
  const patterns = options.components.map((x) => x + suffix);
  logger.log(LogLevel.Debug, `Component patterns`, { data: patterns });

  const ids = await glob(patterns, {
    cwd: options.path,
    onlyFiles: false
  });
  logger.log(LogLevel.Debug, "Found components", { data: ids });

  for (const id of ids) {
    const path = await resolveModule(join(options.path, id), {
      extensions: extensions.map((ext) => `.${ext}`)
    });
    const components = await resolve(await getComponentValue(path), {
      validate: options.validate,
      index: [],
      path
    });

    yield* components;
  }
}
