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

export function handleError(err: Error) {
  let code = 1;
  let msg = err.message;

  if (err.stack) {
    msg = cleanStack(err.stack);
  }

  if (err instanceof CLIError) {
    if (err.output) msg = err.output;
    if (err.code != null) code = err.code;
  }

  // tslint:disable-next-line:no-console
  console.error(msg);
  exit(code);
}
