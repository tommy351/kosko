import { importPath, resolvePath } from "@kosko/require";
import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import logger, { LogLevel } from "@kosko/log";
import { mergeAsync } from "../merge";
import { Environment } from "./types";
import { createAsyncReducerExecutor } from "./base";
import { BUILD_TARGET } from "@kosko/build-scripts";

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
  if (BUILD_TARGET === "browser") {
    throw new Error("createNodeESMEnvironment is only supported on Node.js");
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
      const path = await resolvePath(id, {
        extensions: env.extensions.map((ext) => `.${ext}`)
      });

      if (!path) {
        logger.log(LogLevel.Debug, "Module not found", {
          data: {
            path: id,
            extensions: env.extensions
          }
        });
        return {};
      }

      logger.log(LogLevel.Debug, `Importing ${path}`);

      const mod = await importPath(path);
      return mod.default;
    }
  });
}
