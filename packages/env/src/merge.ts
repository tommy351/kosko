import deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

// https://stackoverflow.com/a/48769843
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export function merge<T extends any[]>(
  ...data: T
): UnionToIntersection<T[number]> {
  return deepMerge.all(data, {
    isMergeableObject: isPlainObject
  }) as any;
}
