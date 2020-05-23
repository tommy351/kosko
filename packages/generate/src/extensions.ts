import requireExtensions from "./requireExtensions";

/** @internal */
export function getExtensions(): ReadonlyArray<string> {
  return Object.keys(requireExtensions).map((ext) => ext.substring(1));
}
