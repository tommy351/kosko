/**
 * Logging library.
 *
 * @packageDocumentation
 */

import { createLogger } from "./createLogger";

export * from "./types";
export { default as ConsoleLogWriter } from "./ConsoleLogWriter";
export { default as SilentLogWriter } from "./SilentLogWriter";
export { LogLevel, logLevelFromString } from "./LogLevel";
export { default as Logger, type LoggerOptions } from "./Logger";
export { createLogger } from "./createLogger";

export default createLogger();
