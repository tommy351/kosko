function defineNonEnumerableProp<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K]
) {
  Object.defineProperty(target, key, { value, enumerable: false });
}

/**
 * This class implements the standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError | AggregateError} class.
 *
 * @public
 */
export default class AggregateError extends Error {
  public readonly errors!: readonly unknown[];
  public readonly cause?: unknown;

  public constructor(
    errors: Iterable<unknown>,
    message?: string,
    options: { cause?: unknown } = {}
  ) {
    super(message);
    defineNonEnumerableProp(this, "errors", [...errors]);
    defineNonEnumerableProp(this, "cause", options.cause);
  }
}

AggregateError.prototype.name = "AggregateError";
