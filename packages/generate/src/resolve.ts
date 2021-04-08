import { Manifest } from "./base";
import debug from "./debug";
import { ValidationError } from "./error";

export interface ResolveOptions {
  /**
   * Execute `validate` method of each values. Default to `true`.
   */
  validate?: boolean;

  /**
   * Source path of a manifest.
   */
  path?: string;

  /**
   * Source index of a manifest.
   */
  index?: number[];
}

/**
 * Flattens the input value and validate each values. Throws `ValidationError`
 * when an error occurred during validation.
 *
 * The `value` can be a:
 *   - Object
 *   - Array
 *   - Function
 *   - Async function
 */
export async function resolve(
  value: unknown,
  options: ResolveOptions = {}
): Promise<readonly Manifest[]> {
  if (typeof value === "function") {
    return resolve(await value(), options);
  }

  const { validate = true, index = [], path = "" } = options;

  if (Array.isArray(value)) {
    const manifests: Manifest[] = [];

    for (let i = 0; i < value.length; i++) {
      const result = await resolve(value[i], {
        validate,
        index: [...index, i],
        path
      });

      manifests.push(...result);
    }

    return manifests;
  }

  if (validate) {
    if (typeof (value as any).validate === "function") {
      try {
        debug("Validating manifest %s in %s", index.join("."), options.path);
        await (value as any).validate();
      } catch (err) {
        throw new ValidationError({
          path,
          index,
          cause: err,
          component: value
        });
      }
    }
  }

  const manifest: Manifest = {
    path,
    index,
    data: value
  };

  return [manifest];
}
