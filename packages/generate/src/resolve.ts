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

export interface PartialResolveResult {
  manifests?: Manifest[];
  error?: unknown;
}

function collectErrors(results: readonly PartialResolveResult[]): unknown[] {
  return results.flatMap((r) => (r.error ? [r.error] : []));
}

function collectManifests(
  results: readonly PartialResolveResult[]
): Manifest[] {
  return results.flatMap((r) => r.manifests ?? []);
}

export function handlePartialResolveResults(
  results: readonly PartialResolveResult[]
) {
  const errors = collectErrors(results);

  if (errors.length) {
    throw aggregateErrors(errors);
  }

  return collectManifests(results);
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

  async function resolveArrayItem(
    value: unknown,
    currentIndex: number
  ): Promise<PartialResolveResult> {
    const manifests: Manifest[] = [];

    try {
      const result = await resolve(value, {
        validate,
        bail,
        index: [...index, currentIndex],
        path
      });

      manifests.push(...result);
    } catch (error) {
      if (bail) {
        throw error;
      }

      return { error };
    }

    return { manifests };
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
    const promises: Promise<PartialResolveResult>[] = [];
    let i = 0;

    try {
      for (const entry of value) {
        promises.push(resolveArrayItem(entry, i++));
      }
    } catch (err) {
      throw createResolveError("Input iterable value thrown an error", err);
    }

    return handlePartialResolveResults(await Promise.all(promises));
  }

  if (isAsyncIterable(value)) {
    const promises: Promise<PartialResolveResult>[] = [];
    let i = 0;

    try {
      for await (const entry of value) {
        promises.push(resolveArrayItem(entry, i++));
      }
    } catch (err) {
      throw createResolveError(
        "Input async iterable value thrown an error",
        err
      );
    }

    return handlePartialResolveResults(await Promise.all(promises));
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
