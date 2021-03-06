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
   *
   * Default values:
   *
   * - Node.js: `process.cwd()`
   * - Browser: `/`
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
   */
  global(): any;

  /**
   * Returns component variables merged with global variables.
   *
   * @param name Component name
   */
  component(name: string): any;
}

export interface Loader {
  /**
   * Returns global variables. If the returned value is an array, the
   * value will be flattened.
   */
  global(): any;

  /**
   * Returns component variables. If the returned value is an array,
   * the value will be flattened.
   *
   * @param name Component name
   */
  component(name: string): any;
}
