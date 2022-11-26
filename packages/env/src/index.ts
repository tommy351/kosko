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
export { createNodeCJSEnvironment } from "./environment/node-cjs";
export { createNodeESMEnvironment } from "./environment/node-esm";
export { env as default } from "./environment/entry";
