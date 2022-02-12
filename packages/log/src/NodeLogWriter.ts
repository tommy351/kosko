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

function formatError(err: any): string {
  if (!err.stack) {
    return err.message || "";
  }

  const stack = cleanStack(err.stack, { pretty: true });
  // Regular expression is from: https://github.com/sindresorhus/extract-stack
  const pos = stack.search(/(?:\n {4}at .*)+/);
  if (!~pos) return stack;

  return stack.substring(0, pos) + pc.gray(stack.substring(pos));
}

export class NodeLogWriter implements LogWriter {
  public write(log: Log): void {
    const { level, time, message, error, data } = log;
    let content = `${formatLevel(level)} - ${message}`;

    if (log.loggerLevel <= LogLevel.Debug) {
      content = `${pc.gray(`[${formatTime(time)}]`)} ${content}`;
    }

    if (data != null) {
      content += ` ${stringify(data, undefined, "  ")}`;
    }

    if (error) {
      content += `\n${pc.gray(formatError(error))}`;
    }

    process.stderr.write(content + "\n");
  }
}
