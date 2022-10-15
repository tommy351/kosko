import { LogLevel } from "./LogLevel";

/**
 * @public
 */
export interface Log {
  loggerLevel: LogLevel;
  level: LogLevel;
  time: Date;
  message?: string;
  error?: unknown;
  data?: unknown;
}

/**
 * @public
 */
export interface LogWriter {
  write(log: Log): void;
}
