/**
 * Manages environments in Kosko.
 *
 * @packageDocumentation
 */

import { createNodeCJSEnvironment } from "./environment/node-cjs";

export * from "./index.base";

export { createNodeESMEnvironment } from "./environment/node-esm";

/**
 * Global {@link Environment} singleton.
 *
 * @public
 */
const env = createNodeCJSEnvironment();

export default env;

// HACK: Export default to module.exports and maintain types above.
if (typeof module !== "undefined") {
  module.exports = Object.assign(exports.default, exports);
  Object.defineProperty(module.exports, "__esModule", { value: true });
}

export { createNodeCJSEnvironment } from "./environment/node-cjs";
