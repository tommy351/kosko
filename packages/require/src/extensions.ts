import { createRequire } from "node:module";

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
    case "node": {
      const req =
        // eslint-disable-next-line no-restricted-globals
        process.env.BUILD_FORMAT === "esm"
          ? createRequire(import.meta.url)
          : require;

      return [".cjs", ".mjs", ...req("../lib/node-extensions.cjs")()];
    }
    case "deno":
      return [".ts", ".js", ".json"];

    default:
      return [".js", ".json"];
  }
}
