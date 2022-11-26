import { importPath, resolve } from "@kosko/require";
import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import logger, { LogLevel } from "@kosko/log";
import { mergeAsync } from "../merge";
import { Environment } from "./types";
import { createAsyncReducerExecutor } from "./base";
import { getErrorCode } from "@kosko/common-utils";

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
  if (process.env.BUILD_TARGET !== "node") {
    throw new Error("createNodeESMEnvironment is only supported on Node.js");
  }

  return createNodeEnvironment({
    ...options,
    createReducerExecutor: createAsyncReducerExecutor,
    mergeValues: mergeAsync,
    requireModule: async (env, id) => {
      let path: string | undefined;

      // Resolve path before importing ESM modules because file extensions are
      // mandatory for `import()`. Import paths which are used in `require()`
      // must be resolved as below.
      //
      // - Directory: `./dir` -> `./dir/index.js`
      // - File: `./file` -> `./file.js`
      //
      // https://nodejs.org/api/esm.html#esm_mandatory_file_extensions
      try {
        path = await resolve(id, {
          extensions: env.extensions.map((ext) => `.${ext}`)
        });
      } catch (err) {
        if (getErrorCode(err) === "MODULE_NOT_FOUND") {
          logger.log(LogLevel.Debug, `Cannot resolve module: ${id}`);
          return {};
        }

        throw err;
      }

      try {
        logger.log(LogLevel.Debug, `Importing ${path}`);
        const mod = await importPath(path);
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
