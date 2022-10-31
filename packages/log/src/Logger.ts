import { LogLevel } from "./LogLevel";
import { Log, LogWriter } from "./types";

/**
 * @public
 */
export interface LoggerOptions {
  level?: LogLevel;
  writer?: LogWriter;
}

/**
 * @public
 */
export default class Logger {
  private level: LogLevel;
  private writer: LogWriter;

  public constructor(options: Required<LoggerOptions>) {
    this.level = options.level;
    this.writer = options.writer;
  }

  /**
   * @example
   * Basic message
   * ```ts
   * logger.log(LogLevel.Info, "basic message");
   * ```
   *
   * @example
   * Error
   * ```ts
   * logger.log(LogLevel.Error, "error log", {
   *   error: new Error("error cause")
   * });
   * ```
   *
   * @example
   * Data
   * ```ts
   * logger.log(LogLevel.Info, "log with data", {
   *   data: {
   *     foo: "bar"
   *   }
   * });
   * ```
   */
  public log(
    level: LogLevel,
    message: string,
    options: Partial<Omit<Log, "level" | "message" | "loggerLevel">> = {}
  ): void {
    if (this.enabled(level)) {
      const { time = new Date(), ...rest } = options;

      this.writer.write({
        loggerLevel: this.level,
        level,
        message,
        time,
        ...rest
      });
    }
  }

  /**
   * Returns logger level.
   */
  public getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Sets logger level.
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Returns true if the given `level` is enabled in logger.
   */
  public enabled(level: LogLevel): boolean {
    return this.level <= level;
  }

  /**
   * Returns writer of logger.
   */
  public getWriter(): LogWriter {
    return this.writer;
  }

  /**
   * Sets writer of logger.
   */
  public setWriter(writer: LogWriter): void {
    this.writer = writer;
  }
}

export function createLoggerFactory(createWriter: () => LogWriter) {
  return (options: Partial<LoggerOptions> = {}): Logger => {
    const { level = LogLevel.Info, writer = createWriter() } = options;

    return new Logger({ level, writer });
  };
}
