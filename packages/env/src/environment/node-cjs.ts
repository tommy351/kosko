import { createNodeEnvironment, NodeEnvironmentOptions } from "./node";
import { Environment } from "./types";
import { createSyncReducerExecutor } from "./base";
import { merge } from "../merge";
import logger, { LogLevel } from "@kosko/log";
import { getErrorCode } from "@kosko/common-utils";

/**
 * Returns a new {@link Environment} which loads environment variables using
 * Node.js's `require()` function.
 *
 * @public
 */
export function createNodeCJSEnvironment(
  options: NodeEnvironmentOptions = {}
): Environment {
  /* istanbul ignore next */
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET !== "node") {
    throw new Error("createNodeCJSEnvironment is only supported on Node.js");
  }

  return createNodeEnvironment({
    ...options,
    createReducerExecutor: createSyncReducerExecutor,
    mergeValues: merge,
    requireModule: (env, id) => {
      // The path doesn't need to be resolved before importing, because `require()`
      // resolves the path automatically anyway.
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(id);
        return mod && mod.__esModule ? mod.default : mod;
      } catch (err) {
        if (getErrorCode(err) === "MODULE_NOT_FOUND") {
          logger.log(LogLevel.Debug, `Cannot find module: ${id}`, {
            error: err
          });
          return {};
        }

        throw err;
      }
    }
  });
}
