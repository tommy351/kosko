import requireExtensions from "./requireExtensions";

export function getExtensions(): ReadonlyArray<string> {
  return Object.keys(requireExtensions).map(ext => ext.substring(1));
}
