/**
 * Manages environments in Kosko.
 *
 * @packageDocumentation
 */

import { createNodeCJSEnvironment } from "./environment/node-cjs";

export * from "./index-base";

export { createNodeESMEnvironment } from "./environment/node-esm";

/**
 * Global {@link Environment} singleton.
 *
 * @public
 */
const env = createNodeCJSEnvironment();

export default env;
export { createNodeCJSEnvironment } from "./environment/node-cjs";
