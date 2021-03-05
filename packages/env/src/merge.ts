import deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

export function merge(data: any[]): any {
  return deepMerge.all(data, {
    isMergeableObject: isPlainObject
  });
}

export async function mergeAsync(data: any[]): Promise<any> {
  const values = await Promise.all(data);
  return merge(values);
}
