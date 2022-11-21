import ConsoleLogWriter from "./ConsoleLogWriter";
import { createLoggerFactory } from "./Logger";

/**
 * @public
 */
export const createLogger = createLoggerFactory(() => new ConsoleLogWriter());
