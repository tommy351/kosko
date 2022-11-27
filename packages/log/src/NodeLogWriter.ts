import pc from "picocolors";
import type { Formatter } from "picocolors/types";
import cleanStack from "clean-stack";
import stringify from "fast-safe-stringify";
import { LogLevel } from "./LogLevel";
import { Log, LogWriter } from "./types";
import { isRecord } from "@kosko/common-utils";
import { stderr } from "node:process";

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

function formatData(data: unknown): string {
  return stringify(data, undefined, "  ");
}

function formatError(err: unknown): string {
  if (typeof err === "string") {
    return err;
  }

  if (isRecord(err)) {
    if (typeof err.stack === "string") {
      return cleanStack(err.stack, { pretty: true });
    }

    if (typeof err.message === "string") {
      return err.message;
    }
  }

  return formatData(err);
}

/**
 * Prints log to `process.stderr`.
 *
 * @public
 */
export default class NodeLogWriter implements LogWriter {
  public write(log: Log): void {
    const { level, time, message, error, data } = log;
    let content = `${formatLevel(level)} -`;

    if (log.loggerLevel <= LogLevel.Debug) {
      content = `${pc.gray(`[${formatTime(time)}]`)} ${content}`;
    }

    if (message) {
      content += ` ${message}`;
    } else if (isRecord(error) && typeof error.message === "string") {
      content += ` ${error.message}`;
    }

    if (data != null) {
      content += ` ${formatData(data)}`;
    }

    if (error) {
      content += `\n${pc.gray(formatError(error))}`;
    }

    stderr.write(content + "\n");
  }
}
