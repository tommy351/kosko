/**
 * @packageDocumentation
 * @module @kosko/env
 */

import { createNodeCJSEnvironment } from "./environment/node-cjs";

export * from "./index.base";
export { createNodeCJSEnvironment };
export { createNodeESMEnvironment } from "./environment/node-esm";

export default createNodeCJSEnvironment();

// HACK: Export default to module.exports and maintain types above.
if (typeof module !== "undefined") {
  module.exports = Object.assign(exports.default, exports);
  Object.defineProperty(module.exports, "__esModule", { value: true });
}
