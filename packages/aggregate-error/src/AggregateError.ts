function defineNonEnumerableProp<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K]
) {
  Object.defineProperty(target, key, { value, enumerable: false });
}

export default class AggregateError extends Error {
  public readonly errors!: unknown[];
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
