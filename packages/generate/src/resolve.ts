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
export interface AsyncResolveOptions {
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
}

/**
 * @public
 */
export type AsyncResolveResult =
  | { type: "success"; manifest: Manifest }
  | { type: "error"; error: ResolveError };

/**
 * Flattens the input value and validate each values.
 *
 * @remarks
 * The `value` can be an object, an array, a `Promise`, a function, an async
 * function, an iterable, or an async iterable.
 *
 * @public
 */
export async function* resolveAsync(
  value: unknown,
  options: AsyncResolveOptions = {}
): AsyncIterable<AsyncResolveResult> {
  const { validate = true, index = [], path = "" } = options;

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
      yield* resolveAsync(await value(), options);
    } catch (err) {
      yield {
        type: "error",
        error: createResolveError("Input function value thrown an error", err)
      };
    }

    return;
  }

  if (isPromiseLike(value)) {
    try {
      yield* resolveAsync(await value, options);
    } catch (err) {
      yield {
        type: "error",
        error: createResolveError("Input promise value rejected", err)
      };
    }

    return;
  }

  if (isIterable(value)) {
    let i = 0;

    for (const entry of value) {
      try {
        yield* resolveAsync(entry, {
          validate,
          index: [...index, i++],
          path
        });
      } catch (err) {
        yield {
          type: "error",
          error: createResolveError("Input iterable value thrown an error", err)
        };
      }
    }

    return;
  }

  if (isAsyncIterable(value)) {
    let i = 0;

    for await (const entry of value) {
      try {
        yield* resolveAsync(entry, {
          validate,
          index: [...index, i++],
          path
        });
      } catch (err) {
        yield {
          type: "error",
          error: createResolveError(
            "Input async iterable value thrown an error",
            err
          )
        };
      }
    }

    return;
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
        yield {
          type: "error",
          error: createResolveError("Validation error", err)
        };

        return;
      }
    }
  }

  const manifest: Manifest = {
    path,
    index,
    data: value
  };

  yield { type: "success", manifest };
}

/**
 * @public
 */
export interface ResolveOptions extends AsyncResolveOptions {
  /**
   * Stop immediately when an error occurred.
   *
   * @defaultValue `false`
   */
  bail?: boolean;
}

/**
 * @throws {@link ResolveError}
 * Thrown if an error occurred.
 *
 * @throws {@link @kosko/aggregate-error#AggregateError}
 * Thrown if multiple errors occurred.
 *
 * @public
 * {@inheritDoc resolveAsync}
 */
export async function resolve(
  value: unknown,
  options: ResolveOptions = {}
): Promise<Manifest[]> {
  const { bail, ...opts } = options;
  const manifests: Manifest[] = [];
  const errors: unknown[] = [];

  for await (const result of resolveAsync(value, opts)) {
    if (result.type === "error") {
      if (bail) throw result.error;
      errors.push(result.error);
    } else {
      manifests.push(result.manifest);
    }
  }

  if (errors.length) {
    throw aggregateErrors(errors);
  }

  return manifests;
}
