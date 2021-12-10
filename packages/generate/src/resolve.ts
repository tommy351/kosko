import { Manifest } from "./base";
import debug from "./debug";
import { ValidationError } from "./error";

interface Validator {
  validate(): Promise<void>;
}

function isValidator(value: unknown): value is Validator {
  return !!value && typeof (value as any).validate === "function";
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  if (value instanceof Promise) return true;

  return (
    !!value &&
    (typeof value === "function" || typeof value === "object") &&
    typeof (value as any).then === "function"
  );
}

function toErrorObject(value: unknown): Error {
  if (value instanceof Error) return value;

  const err: Partial<Error> =
    typeof value === "object" && value != null ? value : {};

  return {
    ...err,
    name: err.name ?? "Error",
    message: err.message ?? ""
  };
}

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
 *   - Promise
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

  if (isPromiseLike(value)) {
    return resolve(await value, options);
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
    if (isValidator(value)) {
      try {
        debug("Validating manifest %s in %s", index.join("."), options.path);
        await value.validate();
      } catch (err) {
        throw new ValidationError({
          path,
          index,
          cause: toErrorObject(err),
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
