import { requireDefault } from "@kosko/require";
import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import debug from "../debug";
import { Environment } from "./types";
import { createSyncReducerExecutor } from "./base";
import { merge } from "../merge";

/**
 * Returns a new `Environment` which loads environment variables using Node.js's
 * `require()` function.
 */
export function createNodeCJSEnvironment(
  options: NodeEnvironmentOptions = {}
): Environment {
  return createNodeEnvironment({
    ...options,
    createReducerExecutor: createSyncReducerExecutor,
    mergeValues: merge,
    requireModule: (env, id) => {
      // The path doesn't need to be resolved before importing, because `require()`
      // resolves the path automatically anyway.
      try {
        return requireDefault(id);
      } catch (err: any) {
        if (err.code === "MODULE_NOT_FOUND") {
          debug("Cannot find module: %s", id);
          return {};
        }

        throw err;
      }
    }
  });
}
