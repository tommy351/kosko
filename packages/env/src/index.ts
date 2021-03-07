/**
 * @packageDocumentation
 * @module @kosko/env
 */

export * from "./index.base";

import { SyncEnvironment } from "./environment/sync";
export default new SyncEnvironment(process.cwd());
export { SyncEnvironment as Environment };

// HACK: Export default to module.exports and maintain types above.
if (typeof module !== "undefined") {
  module.exports = Object.assign(exports.default, exports);
  Object.defineProperty(module.exports, "__esModule", { value: true });
}
