import { requireDefault } from "@kosko/require";
import Debug from "debug";
import glob from "fast-glob";
import { join } from "path";
import { Result, Manifest } from "./base";
import { getExtensions } from "./extensions";
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
  components: ReadonlyArray<string>;

  /**
   * File extensions of components.
   */
  extensions?: ReadonlyArray<string>;

  /**
   * Validate components.
   */
  validate?: boolean;
}

async function getComponentValue(id: string): Promise<any> {
  const mod = requireDefault(id);

  if (typeof mod === "function") {
    return await mod();
  }

  return mod;
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
  const extensions = (options.extensions || getExtensions()).join(",");
  const suffix = `?(.{${extensions}})`;
  const patterns = options.components.map(x => x + suffix);
  debug("Component patterns", patterns);

  const components = await glob(patterns, {
    cwd: options.path,
    onlyFiles: false
  });
  debug("Found components", components);

  const manifests: Manifest[] = [];

  for (const id of components) {
    const path = join(options.path, id);
    const mod = [].concat(await getComponentValue(path));

    for (let i = 0; i < mod.length; i++) {
      const data: any = mod[i];

      if (options.validate) {
        if (typeof data.validate === "function") {
          try {
            debug("Validating manifest %d in %s", i, path);
            await data.validate();
          } catch (err) {
            throw new ValidationError(path, i, err);
          }
        }
      }

      manifests.push({
        path: require.resolve(path),
        index: i,
        data
      });
    }
  }

  return { manifests };
}
