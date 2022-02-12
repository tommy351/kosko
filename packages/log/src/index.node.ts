import { createLoggerFactory } from "./Logger";
import NodeLogWriter from "./NodeLogWriter";

export * from "./index.base";
export { NodeLogWriter };

export const createLogger = createLoggerFactory(() => new NodeLogWriter());

export default createLogger();
