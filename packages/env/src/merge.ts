import deepMerge from "deepmerge";
import isPlainObject from "is-plain-object";

export function merge<T1, T2>(target: T1, source: T2): T1 & T2 {
  return deepMerge<T1, T2>(target, source, {
    isMergeableObject: isPlainObject
  });
}
