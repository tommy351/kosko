import deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

export function merge(data: unknown[]): unknown {
  return deepMerge.all(data as object[], {
    isMergeableObject: isPlainObject
  });
}

export async function mergeAsync(data: unknown[]): Promise<unknown> {
  const values = await Promise.all(data);
  return merge(values);
}
