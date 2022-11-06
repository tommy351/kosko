import { LogLevel } from "./LogLevel";
import { Log, LogWriter } from "./types";

/**
 * Prints logs to console.
 *
 * @public
 */
export default class ConsoleLogWriter implements LogWriter {
  public write(log: Log): void {
    const args = [log.message, log.data, log.error].filter(Boolean);

    switch (log.level) {
      case LogLevel.Trace:
        console.trace(...args);
        break;

      case LogLevel.Debug:
        console.debug(...args);
        break;

      case LogLevel.Info:
        console.info(...args);
        break;

      case LogLevel.Warn:
        console.warn(...args);
        break;

      case LogLevel.Error:
      case LogLevel.Fatal:
        console.error(...args);
        break;
    }
  }
}
