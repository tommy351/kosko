import requireExtensions from "./requireExtensions";

export function getExtensions() {
  return Object.keys(requireExtensions).map(ext => ext.substring(1));
}
