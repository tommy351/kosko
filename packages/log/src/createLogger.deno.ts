import { createLoggerFactory } from "./Logger";
import NodeLogWriter from "./NodeLogWriter";

export const createLogger = createLoggerFactory(() => new NodeLogWriter());
