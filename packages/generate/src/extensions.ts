export function getExtensions() {
  return Object.keys(require.extensions).map(ext => ext.substring(1));
}
