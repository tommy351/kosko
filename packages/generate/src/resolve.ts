import { Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { aggregateErrors, ResolveError } from "./error";
import { isRecord } from "@kosko/common-utils";
import pLimit, { Limit } from "p-limit";
import { validateConcurrency } from "./utils";

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

export async function handleResolvePromises(
  promises: readonly Promise<Manifest[]>[],
  bail?: boolean
): Promise<Manifest[]> {
  if (bail) {
    const results = await Promise.all(promises);
    return results.flatMap((values) => values);
  }

  const results = await Promise.allSettled(promises);
  const errors: unknown[] = [];
  const manifests: Manifest[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      manifests.push(...result.value);
    } else {
      errors.push(result.reason);
    }
  }

  if (errors.length) {
    throw aggregateErrors(errors);
  }

  return manifests;
}

/**
 * @public
 */
export interface ResolveOptions {
  /**
   * Execute `validate` method of each values.
   *
   * @defaultValue `true`
   */
  validate?: boolean;

  /**
   * Source path of a manifest.
   *
   * @defaultValue `""`
   */
  path?: string;

  /**
   * Source index of a manifest.
   *
   * @defaultValue `[]`
   */
  index?: number[];

  /**
   * Stop immediately when an error occurred.
   *
   * @defaultValue `false`
   */
  bail?: boolean;

  /**
   * Maximum number of concurrent tasks.
   *
   * @defaultValue The number of CPU cores.
   */
  concurrency?: number;
}

export interface InternalResolveOptions
  extends Omit<ResolveOptions, "concurrency"> {
  limit: Limit;
}

export async function doResolve(
  value: unknown,
  options: InternalResolveOptions
): Promise<Manifest[]> {
  const { validate = true, index = [], path = "", bail, limit } = options;

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
      return doResolve(await value(), options);
    } catch (err) {
      throw createResolveError("Input function value thrown an error", err);
    }
  }

  if (isPromiseLike(value)) {
    try {
      return doResolve(await value, options);
    } catch (err) {
      throw createResolveError("Input promise value rejected", err);
    }
  }

  if (isIterable(value)) {
    const promises: Promise<Manifest[]>[] = [];
    let i = 0;

    try {
      for (const entry of value) {
        promises.push(
          limit(() =>
            doResolve(entry, {
              ...options,
              index: [...index, i++]
            })
          )
        );
      }
    } catch (err) {
      throw createResolveError("Input iterable value thrown an error", err);
    }

    return handleResolvePromises(promises, bail);
  }

  if (isAsyncIterable(value)) {
    const promises: Promise<Manifest[]>[] = [];
    let i = 0;

    try {
      for await (const entry of value) {
        promises.push(
          limit(() =>
            doResolve(entry, {
              ...options,
              index: [...index, i++]
            })
          )
        );
      }
    } catch (err) {
      throw createResolveError(
        "Input async iterable value thrown an error",
        err
      );
    }

    return handleResolvePromises(promises, bail);
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

/**
 * Flattens the input value and validate each values.
 *
 * @remarks
 * The `value` can be an object, an array, a `Promise`, a function, an async
 * function, an iterable, or an async iterable.
 *
 * @throws {@link ResolveError}
 * Thrown if an error occurred.
 *
 * @throws {@link @kosko/aggregate-error#AggregateError}
 * Thrown if multiple errors occurred.
 *
 * @public
 */
export async function resolve(
  value: unknown,
  options: ResolveOptions = {}
): Promise<Manifest[]> {
  const { concurrency, ...opts } = options;
  const limit = pLimit(validateConcurrency(concurrency));

  return doResolve(value, { ...opts, limit });
}
