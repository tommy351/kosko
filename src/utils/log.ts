import chalk, { Chalk } from "chalk";
import figures from "figures";
import { Writable } from "stream";
import { format } from "util";

type LogFunc = (msg: any, ...params: any[]) => void;

enum Level {
  DEBUG = "debug",
  INFO = "info",
  SUCCESS = "success",
  WARN = "warn",
  ERROR = "error"
}

type Logger = { [key in Level]: LogFunc };

interface LevelOptions {
  level: Level;
  color: Chalk;
  icon: string;
  verbose?: boolean;
}

export let logger: Logger;

const levelOptions: LevelOptions[] = [
  {
    level: Level.DEBUG,
    color: chalk.gray,
    icon: figures.bullet,
    verbose: true
  },
  { level: Level.INFO, color: chalk.blue, icon: figures.info },
  { level: Level.SUCCESS, color: chalk.green, icon: figures.tick },
  { level: Level.WARN, color: chalk.yellow, icon: figures.warning },
  { level: Level.ERROR, color: chalk.red, icon: figures.cross }
];

const maxLevelLength = Math.max(
  ...levelOptions.map(getPrefix).map(s => s.length)
);

function nop() {
  // do nothing
}

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

export function initLogger(args: any = {}) {
  const log: any = {};

  levelOptions.forEach((opt, i) => {
    if (args.verbose || !opt.verbose) {
      log[opt.level] = buildLogFunc(process.stderr, opt);
    } else {
      log[opt.level] = nop;
    }
  });

  logger = log;
}

initLogger();
