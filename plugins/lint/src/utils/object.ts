import { isRecord } from "@kosko/common-utils";

export function getObjectValue(obj: unknown, keys: readonly string[]): unknown {
  let value = obj;

  for (const key of keys) {
    if (!isRecord(value)) return;
    value = value[key];
  }

  return value;
}
