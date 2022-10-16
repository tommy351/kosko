import { createNodeCJSEnvironment } from "./environment/node-cjs";

export * from "./index.base";

export { createNodeESMEnvironment } from "./environment/node-esm";

export default createNodeCJSEnvironment();

// HACK: Export default to module.exports and maintain types above.
if (typeof module !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  module.exports = Object.assign(exports.default, exports);
  Object.defineProperty(module.exports, "__esModule", { value: true });
}

export { createNodeCJSEnvironment } from "./environment/node-cjs";
