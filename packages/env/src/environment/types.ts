import { Paths } from "../paths";
import { Reducer } from "../reduce";

/**
 * A collection of {@link Reducer}.
 *
 * @public
 */
export interface ReducerList {
  /**
   * Returns a list of reducers.
   */
  getReducers(): readonly Reducer[];

  /**
   * Updates reducer list with the return value of `callback`.
   */
  setReducers(callback: (reducers: readonly Reducer[]) => Reducer[]): void;

  /**
   * Resets reducer list to the defaults.
   */
  resetReducers(): void;
}

export interface ReducerExecutor {
  reduce(componentName?: string): any;
}

/**
 * Contains environment context and can be used to fetch environment variables.
 *
 * @public
 */
export interface Environment
  extends Pick<ReducerList, "setReducers" | "resetReducers"> {
  /**
   * Current working directory (CWD).
   *
   * @defaultValue `process.cwd()` on Node.js, or `/` on browsers.
   */
  cwd: string;

  /**
   * Current environment.
   */
  env?: string | string[];

  /**
   * Path patterns of environment files.
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
   * @param name - Component name
   */
  component(name: string): any;
}

/**
 * Loads environment variables.
 *
 * @public
 */
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
   * @param name - Component name
   */
  component(name: string): any;
}
