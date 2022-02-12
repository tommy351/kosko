import ConsoleLogWriter from "./ConsoleLogWriter";
import { createLoggerFactory } from "./Logger";

export * from "./index.base";

export const createLogger = createLoggerFactory(() => new ConsoleLogWriter());

export default createLogger();
