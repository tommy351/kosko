import { Paths } from "../paths";
import { Reducer } from "../reduce";

export interface ReducerList {
  /**
   * Returns a list of reducers.
   */
  getReducers(): readonly Reducer[];

  /**
   * Sets list of reducers using the specified callback function.
   */
  setReducers(
    callback: (reducers: readonly Reducer[]) => readonly Reducer[]
  ): void;

  /**
   * Resets reducers to the defaults.
   */
  resetReducers(): void;
}

export interface ReducerExecutor {
  reduce(componentName?: string): any;
}

export interface Environment
  extends Pick<ReducerList, "setReducers" | "resetReducers"> {
  /**
   * Current working directory.
   */
  cwd: string;

  /**
   * Current environment.
   */
  env?: string | string[];

  /**
   * Paths of environment files.
   */
  paths: Paths;

  /**
   * File extensions of environments.
   */
  extensions: string[];

  /**
   * Returns global variables.
   *
   * If env is not set or require failed, returns an empty object.
   */
  global(): any;

  /**
   * Returns component variables merged with global variables.
   *
   * If env is not set or require failed, returns an empty object.
   *
   * @param name Component name
   */
  component(name: string): any;
}

export interface Loader {
  global(): any;
  component(name: string): any;
}
