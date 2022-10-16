import { Environment, Loader, ReducerExecutor, ReducerList } from "./types";
import { reduce, reduceAsync, Reducer } from "../reduce";
import { merge, mergeAsync } from "../merge";
import { toArray } from "@kosko/common-utils";

export type EnvironmentOptions = Pick<
  ReducerList,
  "setReducers" | "resetReducers"
> &
  ReducerExecutor &
  Partial<Pick<Environment, "cwd" | "extensions">>;

export function createEnvironment({
  cwd = "/",
  extensions = [],
  setReducers,
  resetReducers,
  reduce
}: EnvironmentOptions): Environment {
  return {
    cwd,
    paths: {
      global: "environments/#{environment}",
      component: "environments/#{environment}/#{component}"
    },
    extensions,
    setReducers,
    resetReducers,
    global: () => reduce(),
    component: (name) => reduce(name)
  };
}

export function createLoaderReducers(
  loader: Loader,
  mergeValues: (data: any[]) => any
): Reducer[] {
  return [
    {
      name: "global",
      reduce: (values) => mergeValues([values, ...toArray(loader.global())])
    },
    {
      name: "component",
      reduce: (values, componentName) => {
        if (!componentName) return values;

        return mergeValues([
          values,
          ...toArray(loader.component(componentName))
        ]);
      }
    }
  ];
}

/**
 * Returns the default reducers which load environment variables synchronously
 * using the specified `loader`.
 *
 * @public
 */
export function createSyncLoaderReducers(loader: Loader): Reducer[] {
  return createLoaderReducers(loader, merge);
}

/**
 * Returns the default reducers which load environment variables asynchronously
 * using the specified `loader`.
 *
 * @public
 */
export function createAsyncLoaderReducers(loader: Loader): Reducer[] {
  return createLoaderReducers(loader, mergeAsync);
}

export function createReducerList(
  initialReducers: readonly Reducer[] = []
): ReducerList {
  let reducers: readonly Reducer[] = [];

  function resetReducers() {
    reducers = [...initialReducers];
  }

  resetReducers();

  return {
    getReducers: () => reducers,
    setReducers: (callback) => {
      reducers = callback([...reducers]);
    },
    resetReducers
  };
}

export function createSyncReducerExecutor({
  getReducers
}: ReducerList): ReducerExecutor {
  return {
    reduce: (componentName) => reduce(getReducers(), componentName)
  };
}

export function createAsyncReducerExecutor({
  getReducers
}: ReducerList): ReducerExecutor {
  return {
    reduce: (componentName) => reduceAsync(getReducers(), componentName)
  };
}
