import { LogLevel } from "./LogLevel";

export interface Log {
  loggerLevel: LogLevel;
  level: LogLevel;
  time: Date;
  message?: string;
  error?: unknown;
  data?: unknown;
}

export interface LogWriter {
  write(log: Log): void;
}
