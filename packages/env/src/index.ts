/**
 * @packageDocumentation
 * @module @kosko/env
 */

import { Environment, Reducer } from "./environment";

export default new Environment(process.cwd());
export { Environment, Reducer };
export { Paths } from "./paths";

// HACK: Export default to module.exports and maintain types above.
if (typeof module !== "undefined") {
  module.exports = Object.assign(exports.default, exports);
  Object.defineProperty(module.exports, "__esModule", { value: true });
}
