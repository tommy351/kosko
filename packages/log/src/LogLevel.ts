/**
 * @public
 */
export enum LogLevel {
  Trace = 1,
  Debug = 2,
  Info = 3,
  Warn = 4,
  Error = 5,
  Fatal = 6
}

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  trace: LogLevel.Trace,
  debug: LogLevel.Debug,
  info: LogLevel.Info,
  warn: LogLevel.Warn,
  error: LogLevel.Error,
  fatal: LogLevel.Fatal
};

/**
 * @public
 */
export function logLevelFromString(level: string): LogLevel | undefined {
  return LOG_LEVEL_MAP[level];
}
