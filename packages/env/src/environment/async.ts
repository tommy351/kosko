import {
  createAsyncReducerExecutor,
  createEnvironment,
  createReducerList
} from "./base";
import { Environment } from "./types";

/**
 * Returns a new asynchronized `Environment`.
 */
export function createAsyncEnvironment(): Environment {
  const reducers = createReducerList();
  const { reduce } = createAsyncReducerExecutor(reducers);

  return createEnvironment({
    ...reducers,
    reduce
  });
}
