/**
 * Manages environments in Kosko.
 *
 * @packageDocumentation
 */

export type { Paths } from "./paths";
export type { Reducer } from "./reduce";
export type { Environment, Loader, ReducerList } from "./environment/types";
export {
  createSyncLoaderReducers,
  createAsyncLoaderReducers
} from "./environment/base";
export type { NodeEnvironmentOptions } from "./environment/node";
export { createAsyncEnvironment } from "./environment/async";
export { createSyncEnvironment } from "./environment/sync";
export * from "./environment/entry";
export { default } from "./environment/entry";
