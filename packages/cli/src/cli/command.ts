import { Arguments, Argv, CommandModule } from "yargs";
import { CLIError } from "./error";
import signale from "signale";

const RESOLVE = Symbol("resolve");
const REJECT = Symbol("reject");
const HANDLED = Symbol("executed");
const LOGGER = Symbol("logger");

export interface Context {
  [RESOLVE]: (value?: any) => void;
  [REJECT]: (reason?: any) => void;
  [LOGGER]?: signale.Signale;
  [HANDLED]?: boolean;
}

export interface RootArguments {
  cwd: string;
  silent: boolean;
}

type CommandHandler<T> = (args: Arguments<T> & Context) => Promise<void>;
type RootCommandModule<T> = CommandModule<RootArguments, T>;

export interface Command<T>
  extends Pick<
    RootCommandModule<T>,
    Exclude<keyof RootCommandModule<T>, "handler">
  > {
  handler: CommandHandler<T>;
}

export function getLogger(ctx: Context): signale.Signale {
  const logger = ctx[LOGGER];
  if (logger) return logger;
  throw new Error("Logger is not set in the context");
}

export function setLogger<T extends Context>(
  ctx: T,
  logger: signale.Signale
): T {
  return {
    ...ctx,
    [LOGGER]: logger
  };
}

export function wrapHandler<T extends RootArguments>(
  handler: CommandHandler<T>
): CommandHandler<T> {
  return async (args): Promise<void> => {
    const logger = new signale.Signale({
      stream: process.stderr,
      disabled: args.silent
    });

    args[HANDLED] = true;
    args = setLogger(args, logger);

    handler(args).then(args[RESOLVE]).catch(args[REJECT]);
  };
}

export function wrapCommand<T extends RootArguments>(
  cmd: Command<T>
): RootCommandModule<T> {
  return {
    ...cmd,
    handler: wrapHandler(cmd.handler)
  } as any;
}

function handleParse(err: Error | undefined, args: any, output: string): void {
  const ctx = args as Context;

  if (err || output) {
    const msg = err ? err.message : "CLI error";
    return ctx[REJECT](new CLIError(msg, { output, code: err ? 1 : 0 }));
  }

  if (!ctx[HANDLED]) {
    ctx[RESOLVE]();
  }
}

export function parse(input: Argv, argv: string[]): Promise<void> {
  return new Promise((resolve, reject): void => {
    const ctx: Context = { [RESOLVE]: resolve, [REJECT]: reject };
    input.parse(argv, ctx, handleParse);
  });
}
