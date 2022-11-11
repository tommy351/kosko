export * from "./index-base";

import { createAsyncEnvironment } from "./environment/async";
import type { createNodeCJSEnvironment as _createNodeCJSEnvironment } from "./environment/node-cjs";
import type { createNodeESMEnvironment as _createNodeESMEnvironment } from "./environment/node-esm";

export default createAsyncEnvironment();

export const createNodeCJSEnvironment: typeof _createNodeCJSEnvironment =
  () => {
    throw new Error("createNodeCJSEnvironment is only supported on Node.js");
  };

export const createNodeESMEnvironment: typeof _createNodeESMEnvironment =
  () => {
    throw new Error("createNodeESMEnvironment is only supported on Node.js");
  };
