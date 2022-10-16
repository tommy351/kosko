import { requireDefault } from "@kosko/require";
import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import { Environment } from "./types";
import { createSyncReducerExecutor } from "./base";
import { merge } from "../merge";
import logger, { LogLevel } from "@kosko/log";
import { getErrorCode } from "@kosko/utils";

/**
 * Returns a new `Environment` which loads environment variables using Node.js's
 * `require()` function.
 *
 * @public
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
      } catch (err) {
        if (getErrorCode(err) === "MODULE_NOT_FOUND") {
          logger.log(LogLevel.Debug, `Cannot find module: ${id}`);
          return {};
        }

        throw err;
      }
    }
  });
}
