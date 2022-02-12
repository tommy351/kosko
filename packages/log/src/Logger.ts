import { LogLevel } from "./LogLevel";
import { Log, LogWriter } from "./types";

export interface LoggerOptions {
  level?: LogLevel;
  writer?: LogWriter;
}

export class Logger {
  private level: LogLevel;
  private writer: LogWriter;

  public constructor(options: Required<LoggerOptions>) {
    this.level = options.level;
    this.writer = options.writer;
  }

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

  public getLevel(): LogLevel {
    return this.level;
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public enabled(level: LogLevel): boolean {
    return this.level <= level;
  }

  public getWriter(): LogWriter {
    return this.writer;
  }

  public setWriter(writer: LogWriter): void {
    this.writer = writer;
  }
}

export function createLoggerFactory(writer: LogWriter) {
  return (options?: Partial<LoggerOptions>): Logger => {
    return new Logger({
      level: LogLevel.Info,
      writer,
      ...options
    });
  };
}
