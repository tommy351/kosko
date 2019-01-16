import chalk from "chalk";
import cleanStack from "clean-stack";
import exit from "exit";

export class CLIError extends Error {
  public readonly name = "CLIError";
  public readonly output?: string;
  public readonly code?: number;

  constructor(
    msg: string,
    { output, code }: { output?: string; code?: number } = {}
  ) {
    super(msg);
    this.output = output;
    this.code = code;
  }
}

export function formatError(err: Error) {
  if (!err.stack) return err.message;

  const stack = cleanStack(err.stack, { pretty: true });
  // Regular expression is from: https://github.com/sindresorhus/extract-stack
  const pos = stack.search(/(?:\n {4}at .*)+/);
  if (!~pos) return stack;

  return stack.substring(0, pos) + chalk.gray(stack.substring(pos));
}

export function handleError(err: any) {
  let code = 1;
  let msg = err;

  if (err instanceof CLIError) {
    msg = err.output || formatError(err);
    if (err.code != null) code = err.code;
  } else if (err instanceof Error) {
    msg = formatError(err);
  }

  // tslint:disable-next-line:no-console
  console.error(msg);
  exit(code);
}
