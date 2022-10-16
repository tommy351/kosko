export function isRecord(
  value: unknown
): value is Record<string | symbol, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function toArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input];
}

export function getErrorCode(err: unknown): string | undefined {
  if (isRecord(err) && typeof err.code === "string") {
    return err.code;
  }
}
