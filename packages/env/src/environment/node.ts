import { getRequireExtensions } from "@kosko/require";
import { join } from "path";
import { formatPath } from "../paths";
import { toArray } from "../utils";
import {
  createEnvironment,
  createLoaderReducers,
  createReducerList
} from "./base";
import { Environment, Loader, ReducerExecutor, ReducerList } from "./types";

export function getNodeExtensions(): string[] {
  return getRequireExtensions().map((ext) => ext.substring(1));
}

export interface NodeEnvironmentOptions {
  /**
   * Current working directory.
   */
  cwd?: string;
}

export interface InternalNodeEnvironmentOptions extends NodeEnvironmentOptions {
  createReducerExecutor(reducers: ReducerList): ReducerExecutor;
  requireModule(environment: Environment, id: string): any;
  mergeValues(data: any[]): any;
}

export function createNodeEnvironment({
  cwd = process.cwd(),
  createReducerExecutor,
  requireModule,
  mergeValues
}: InternalNodeEnvironmentOptions): Environment {
  function requireAllEnvs(template: string, component?: string) {
    if (!environment.env) return [];

    const envs = toArray(environment.env);

    return envs.map((env) => {
      const path = formatPath(template, {
        environment: env,
        ...(component && { component })
      });

      return requireModule(environment, join(environment.cwd, path));
    });
  }

  const loader: Loader = {
    global: () => requireAllEnvs(environment.paths.global),
    component: (name) => requireAllEnvs(environment.paths.component, name)
  };
  const reducers = createReducerList(createLoaderReducers(loader, mergeValues));
  const { reduce } = createReducerExecutor(reducers);
  const environment = createEnvironment({
    cwd,
    extensions: getNodeExtensions(),
    setReducers: reducers.setReducers,
    resetReducers: reducers.resetReducers,
    reduce
  });

  return environment;
}
