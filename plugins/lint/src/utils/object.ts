import { isRecord } from "@kosko/common-utils";

export function getObjectPath<T>(
  value: unknown,
  path: readonly string[]
): T | undefined {
  let current: unknown = value;

  for (const key of path) {
    if (!isRecord(current)) return;
    current = current[key];
  }

  return current as T;
}
