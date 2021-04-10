import {
  createSyncReducerExecutor,
  createEnvironment,
  createReducerList
} from "./base";
import { Environment } from "./types";

export function createSyncEnvironment(): Environment {
  const reducers = createReducerList();
  const { reduce } = createSyncReducerExecutor(reducers);

  return createEnvironment({
    ...reducers,
    reduce
  });
}
