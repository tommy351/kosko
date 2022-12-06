import { resolve } from "@kosko/require";
import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import logger, { LogLevel } from "@kosko/log";
import { mergeAsync } from "../merge";
import { Environment } from "./types";
import { createAsyncReducerExecutor } from "./base";
import { getErrorCode } from "@kosko/common-utils";
import { pathToFileURL } from "node:url";

const MODULE_NOT_FOUND_ERROR_CODES = new Set([
  "ERR_MODULE_NOT_FOUND",
  "MODULE_NOT_FOUND"
]);

/**
 * Returns a new {@link Environment} which loads environment variables using
 * ECMAScript module (ESM) `import()` function.
 *
 * @public
 */
export function createNodeESMEnvironment(
  options: NodeEnvironmentOptions = {}
): Environment {
  /* istanbul ignore next */
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "browser") {
    throw new Error(
      "createNodeESMEnvironment is only supported on Node.js and Deno"
    );
  }

  return createNodeEnvironment({
    ...options,
    createReducerExecutor: createAsyncReducerExecutor,
    mergeValues: mergeAsync,
    requireModule: async (env, id) => {
      // Resolve path before importing ESM modules because file extensions are
      // mandatory for `import()`. Import paths which are used in `require()`
      // must be resolved as below.
      //
      // - Directory: `./dir` -> `./dir/index.js`
      // - File: `./file` -> `./file.js`
      //
      // https://nodejs.org/api/esm.html#esm_mandatory_file_extensions
      const path = await resolve(id, {
        extensions: env.extensions.map((ext) => `.${ext}`)
      });

      if (!path) {
        logger.log(LogLevel.Debug, `Module not found: ${id}`);
        return {};
      }

      try {
        logger.log(LogLevel.Debug, `Importing ${path}`);

        const url = pathToFileURL(path).toString();
        const mod = await import(url);
        return mod.default;
      } catch (err) {
        const code = getErrorCode(err);

        if (code && MODULE_NOT_FOUND_ERROR_CODES.has(code)) {
          logger.log(LogLevel.Debug, `Cannot import module: ${path}`);
          return {};
        }

        throw err;
      }
    }
  });
}
