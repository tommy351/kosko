import { importPath, resolve } from "@kosko/require";
import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import debug from "../debug";
import { mergeAsync } from "../merge";
import { Environment } from "./types";
import { createAsyncReducerExecutor } from "./base";

export function createNodeESMEnvironment(
  options: NodeEnvironmentOptions = {}
): Environment {
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
        if (err.code === "MODULE_NOT_FOUND") {
          debug("Cannot resolve module: %s", id);
          return {};
        }

        throw err;
      }

      try {
        debug("Importing %s", path);
        const mod = await importPath(path);
        return mod.default;
      } catch (err) {
        if (["ERR_MODULE_NOT_FOUND", "MODULE_NOT_FOUND"].includes(err.code)) {
          debug("Cannot import module: %s", path);
          return {};
        }

        throw err;
      }
    }
  });
}
