import {
  importPath,
  resolve as resolveModule,
  getRequireExtensions
} from "@kosko/require";
import { glob, joinPath } from "@kosko/system-utils";
import { Result, Manifest } from "./base";
import debug from "./debug";
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
  const extensions =
    options.extensions || getRequireExtensions().map((ext) => ext.substring(1));
  const suffix = `?(.{${extensions.join(",")}})`;
  const patterns = options.components.map((x) => x + suffix);
  debug("Component patterns", patterns);

  const entries = await glob(patterns, {
    cwd: options.path,
    onlyFiles: false
  });
  const ids = entries.map((entry) => entry.relativePath);
  debug("Found components", ids);

  const manifests: Manifest[] = [];

  for (const id of ids) {
    const path = await resolveModule(joinPath(options.path, id), {
      extensions: extensions.map((ext) => `.${ext}`)
    });
    const components = await resolve(await getComponentValue(path), {
      validate: options.validate,
      index: [],
      path
    });

    manifests.push(...components);
  }

  return { manifests };
}
