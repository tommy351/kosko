/**
 * Logging library.
 *
 * @packageDocumentation
 */

import { createLoggerFactory } from "./Logger";
import NodeLogWriter from "./NodeLogWriter";

export * from "./index.base";

/**
 * @public
 */
export const createLogger = createLoggerFactory(() => new NodeLogWriter());

export default createLogger();

export { default as NodeLogWriter } from "./NodeLogWriter";
