import pc from "picocolors";
import { Formatter } from "picocolors/types";
import cleanStack from "clean-stack";
import stringify from "fast-safe-stringify";
import { LogLevel } from "./LogLevel";
import { Log, LogWriter } from "./types";

const COLOR_MAP: Record<LogLevel, Formatter> = {
  [LogLevel.Trace]: pc.gray,
  [LogLevel.Debug]: pc.cyan,
  [LogLevel.Info]: pc.green,
  [LogLevel.Warn]: pc.yellow,
  [LogLevel.Error]: pc.red,
  [LogLevel.Fatal]: pc.bgRed
};

const LEVEL_MAX_LENGTH = Math.max(
  ...Object.keys(LogLevel).map((x) => x.length)
);

function formatLevel(level: LogLevel): string {
  const label = LogLevel[level].toLowerCase().padEnd(LEVEL_MAX_LENGTH, " ");

  return COLOR_MAP[level](label);
}

function formatTime(time: Date): string {
  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");
  const ms = time.getMilliseconds().toString().padStart(3, "0");

  return `${h}:${m}:${s}.${ms}`;
}

function formatData(data: any): string {
  return stringify(data, undefined, "  ");
}

function formatError(err: any): string {
  if (!err.stack) {
    if (err.message) return err.message;
    return formatData(err);
  }

  const stack = cleanStack(err.stack, { pretty: true });
  return stack;
}

export default class NodeLogWriter implements LogWriter {
  public write(log: Log): void {
    const { level, time, message, error, data } = log;
    let content = `${formatLevel(level)} -`;

    if (log.loggerLevel <= LogLevel.Debug) {
      content = `${pc.gray(`[${formatTime(time)}]`)} ${content}`;
    }

    if (message) {
      content += ` ${message}`;
    } else if (error && (error as any).message) {
      content += ` ${(error as any).message}`;
    }

    if (data != null) {
      content += ` ${formatData(data)}`;
    }

    if (error) {
      content += `\n${pc.gray(formatError(error))}`;
    }

    process.stderr.write(content + "\n");
  }
}
