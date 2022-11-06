/**
 * Common utilities used in Kosko.
 *
 * @packageDocumentation
 */

/**
 * Returns true when type of `value` is `object` and is not `null`, `undefined` or
 * an array.
 *
 * @public
 */
export function isRecord(
  value: unknown
): value is Record<string | symbol, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Transforms `input` into an array, or leave it as-is if `input` is already an array.
 *
 * @public
 */
export function toArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input];
}

/**
 * Returns `code` of an error-like object.
 *
 * @public
 */
export function getErrorCode(err: unknown): string | undefined {
  if (isRecord(err) && typeof err.code === "string") {
    return err.code;
  }
}
