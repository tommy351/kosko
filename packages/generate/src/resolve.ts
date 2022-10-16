import { Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { aggregateErrors, ResolveError } from "./error";
import { isRecord } from "@kosko/common-utils";

interface Validator {
  validate(): void | Promise<void>;
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

function isIterable(value: unknown): value is Iterable<unknown> {
  return (
    typeof value === "object" &&
    value != null &&
    typeof (value as any)[Symbol.iterator] === "function"
  );
}

function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return isRecord(value) && typeof value[Symbol.asyncIterator] === "function";
}

/**
 * @public
 */
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

  /**
   * When this option is `true`, `resolve` will stop immediately if an error
   * occurred.  Otherwise, it will collect all errors and return an
   * `AggregateError`. By default, this option is `false`.
   */
  bail?: boolean;
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
 *   - Iterable
 *   - Async iterable
 *
 * @public
 */
export async function resolve(
  value: unknown,
  options: ResolveOptions = {}
): Promise<Manifest[]> {
  const { validate = true, index = [], path = "", bail } = options;

  function createResolveError(message: string, err: unknown) {
    if (err instanceof ResolveError) return err;

    return new ResolveError(message, {
      path,
      index,
      value,
      cause: err
    });
  }

  if (typeof value === "function") {
    try {
      return resolve(await value(), options);
    } catch (err) {
      throw createResolveError("Input function value thrown an error", err);
    }
  }

  if (isPromiseLike(value)) {
    try {
      return resolve(await value, options);
    } catch (err) {
      throw createResolveError("Input promise value rejected", err);
    }
  }

  if (isIterable(value)) {
    const manifests: Manifest[] = [];
    const errors: unknown[] = [];
    let i = 0;

    try {
      for (const entry of value) {
        try {
          const result = await resolve(entry, {
            validate,
            bail,
            index: [...index, i++],
            path
          });

          manifests.push(...result);
        } catch (err) {
          if (bail) {
            throw err;
          }

          errors.push(err);
        }
      }
    } catch (err) {
      throw createResolveError("Input iterable value thrown an error", err);
    }

    if (errors.length) {
      throw aggregateErrors(errors);
    }

    return manifests;
  }

  if (isAsyncIterable(value)) {
    const manifests: Manifest[] = [];
    const errors: unknown[] = [];
    let i = 0;

    try {
      for await (const entry of value) {
        try {
          const result = await resolve(entry, {
            validate,
            bail,
            index: [...index, i++],
            path
          });

          manifests.push(...result);
        } catch (err) {
          if (bail) {
            throw err;
          }

          errors.push(err);
        }
      }
    } catch (err) {
      throw createResolveError(
        "Input async iterable value thrown an error",
        err
      );
    }

    if (errors.length) {
      throw aggregateErrors(errors);
    }

    return manifests;
  }

  if (validate) {
    if (isValidator(value)) {
      try {
        logger.log(
          LogLevel.Debug,
          `Validating manifests ${index.join(".")} in ${options.path}`
        );
        await value.validate();
      } catch (err) {
        throw createResolveError("Validation error", err);
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
