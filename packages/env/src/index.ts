/**
 * @packageDocumentation
 * @module @kosko/env
 */

export * from "./index.base";

import { createNodeCJSEnvironment } from "./environment/node-cjs";
export default createNodeCJSEnvironment();

// HACK: Export default to module.exports and maintain types above.
if (typeof module !== "undefined") {
  module.exports = Object.assign(exports.default, exports);
  Object.defineProperty(module.exports, "__esModule", { value: true });
}
