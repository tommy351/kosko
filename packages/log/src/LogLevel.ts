export enum LogLevel {
  Trace = 10,
  Debug = 20,
  Info = 30,
  Warn = 40,
  Error = 50,
  Fatal = 60
}

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  trace: LogLevel.Trace,
  debug: LogLevel.Debug,
  info: LogLevel.Info,
  warn: LogLevel.Warn,
  error: LogLevel.Error,
  fatal: LogLevel.Fatal
};

export function logLevelFromString(level: string): LogLevel | undefined {
  return LOG_LEVEL_MAP[level];
}
