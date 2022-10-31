import {
  createSyncReducerExecutor,
  createEnvironment,
  createReducerList
} from "./base";
import { Environment } from "./types";

/**
 * Returns a new synchronized {@link Environment}.
 *
 * @public
 */
export function createSyncEnvironment(): Environment {
  const reducers = createReducerList();
  const { reduce } = createSyncReducerExecutor(reducers);

  return createEnvironment({
    ...reducers,
    reduce
  });
}
