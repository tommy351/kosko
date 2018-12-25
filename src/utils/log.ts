import chalk, { Chalk } from "chalk";
import figures from "figures";
import { Writable } from "stream";
import stringWidth from "string-width";
import { format } from "util";
import { nop } from "./nop";

export type LogFunc = (msg: any, ...params: any[]) => void;

export enum Level {
  Debug = "debug",
  Info = "info",
  Success = "success",
  Warn = "warn",
  Error = "error"
}

export type Logger = { [key in Level]: LogFunc };

export interface LoggerOptions {
  verbose?: boolean;
}

interface LevelOptions {
  level: Level;
  color: Chalk;
  icon: string;
  verbose?: boolean;
}

const levelOptions: LevelOptions[] = [
  {
    level: Level.Debug,
    color: chalk.gray,
    icon: figures.bullet,
    verbose: true
  },
  { level: Level.Info, color: chalk.blue, icon: figures.info },
  { level: Level.Success, color: chalk.green, icon: figures.tick },
  { level: Level.Warn, color: chalk.yellow, icon: figures.warning },
  { level: Level.Error, color: chalk.red, icon: figures.cross }
];

const maxLevelLength = Math.max(
  ...levelOptions.map(getPrefix).map(stringWidth)
);

function getPrefix(opt: LevelOptions) {
  return `${opt.icon} ${opt.level}`;
}

function buildLogFunc(writer: Writable, opt: LevelOptions) {
  let prefix = getPrefix(opt);

  for (let i = prefix.length; i <= maxLevelLength; i++) {
    prefix += " ";
  }

  prefix = opt.color(prefix);

  return (msg: any, ...params: any[]) => {
    writer.write(prefix + format(msg, ...params) + "\n");
  };
}

export function newLogger(args: LoggerOptions = {}): Logger {
  const logger = newNopLogger();

  for (const opt of levelOptions) {
    if (args.verbose || !opt.verbose) {
      logger[opt.level] = buildLogFunc(process.stderr, opt);
    }
  }

  return logger;
}

export function newNopLogger(): Logger {
  const logger: any = {};

  for (const opt of levelOptions) {
    logger[opt.level] = nop;
  }

  return logger;
}
