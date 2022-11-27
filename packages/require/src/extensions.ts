/**
 * Returns file extensions which can be imported.
 *
 * @defaultValue Node.js
 * ```js
 * [".cjs", ".mjs", ".js", ".json", ".node"]
 * ```
 *
 * @public
 */
export function getRequireExtensions(): string[] {
  // eslint-disable-next-line no-restricted-globals
  switch (process.env.BUILD_TARGET) {
    case "node":
      // eslint-disable-next-line node/no-deprecated-api
      return [".cjs", ".mjs", ...Object.keys(require.extensions)];

    case "deno":
      return [".ts", ".js", ".json"];

    default:
      return [".js", ".json"];
  }
}
