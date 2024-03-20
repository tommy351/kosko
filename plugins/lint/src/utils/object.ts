import { isRecord } from "@kosko/common-utils";

export function getObjectValue(obj: unknown, keys: readonly string[]): unknown {
  let value = obj;

  for (const key of keys) {
    if (!isRecord(value)) return;
    value = value[key];
  }

  return value;
}

export function shallowObjectContains(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  return Object.keys(b).every((k) => a[k] === b[k]);
}
