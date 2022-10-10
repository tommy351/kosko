export default class AggregateError extends Error {
  public readonly errors: unknown[];
  public readonly cause?: unknown;

  public constructor(
    errors: Iterable<unknown>,
    message?: string,
    options?: {
      cause?: unknown;
    }
  );
}
