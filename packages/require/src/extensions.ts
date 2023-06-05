import { createRequire } from "node:module";

const BASE_EXTENSIONS = [".js", ".json"];

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

      const extensions = new Set([
        ".cjs",
        ".mjs",
        ...BASE_EXTENSIONS,
        // The global `require` function includes extensions registered by
        // other package (e.g. ts-node).
        // However, this function always returns an empty array on Node.js 20+.
        ...req("../lib/node-extensions.cjs")()
      ]);

      return [...extensions];
    }

    default:
      return BASE_EXTENSIONS;
  }
}
