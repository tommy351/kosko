import { Manifest } from "./base";
import logger, { LogLevel } from "@kosko/log";
import { aggregateErrors, ResolveError } from "./error";
import { isRecord } from "@kosko/common-utils";
import pLimit from "p-limit";
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
   * @defaultValue `10`
   */
  concurrency?: number;

  /**
   * Transform a manifest. This function is called when a new manifest is found,
   * and before the validation. The return value will override the data of the
   * manifest. If the return value is `undefined` or `null`, the manifest will
   * be removed from the result.
   */
  transform?(manifest: Manifest): unknown;

  /**
   * Execute after a manifest is validated, no matter if a manifest implements
   * a `validate` method or not.
   */
  afterValidate?(manifest: Manifest): void | Promise<void>;
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
 * @throws AggregateError
 * Thrown if multiple errors occurred.
 *
 * @public
 */
export async function resolve(
  value: unknown,
  options: ResolveOptions = {}
): Promise<Manifest[]> {
  const {
    validate = true,
    index = [],
    path = "",
    bail,
    concurrency,
    transform,
    afterValidate
  } = options;
  const limit = pLimit(validateConcurrency(concurrency));

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
      throw createResolveError("Input function value threw an error", err);
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
    const promises: Promise<Manifest[]>[] = [];
    let i = 0;

    try {
      for (const entry of value) {
        promises.push(
          limit(() =>
            resolve(entry, {
              ...options,
              index: [...index, i++]
            })
          )
        );
      }
    } catch (err) {
      throw createResolveError("Input iterable value threw an error", err);
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
            resolve(entry, {
              ...options,
              index: [...index, i++]
            })
          )
        );
      }
    } catch (err) {
      throw createResolveError(
        "Input async iterable value threw an error",
        err
      );
    }

    return handleResolvePromises(promises, bail);
  }

  let manifest: Manifest = {
    path,
    index,
    data: value
  };

  if (typeof transform === "function") {
    try {
      const newValue = await transform(manifest);

      // Remove the manifest if the return value is undefined or null
      if (newValue == null) return [];

      // Create a new object to avoid mutation
      manifest = { ...manifest, data: newValue };
    } catch (err) {
      throw createResolveError("An error occurred in transform function", err);
    }
  }

  if (validate) {
    if (isValidator(manifest.data)) {
      try {
        logger.log(
          LogLevel.Debug,
          `Validating manifests ${index.join(".")} in ${options.path}`
        );
        await manifest.data.validate();
      } catch (err) {
        throw createResolveError("Validation error", err);
      }
    }

    if (typeof afterValidate === "function") {
      try {
        await afterValidate(manifest);
      } catch (err) {
        throw createResolveError(
          "An error occurred in afterValidate function",
          err
        );
      }
    }
  }

  return [manifest];
}
