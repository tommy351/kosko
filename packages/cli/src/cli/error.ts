import cleanStack from "clean-stack";

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

  if (err instanceof CLIError) {
    if (err.output) msg = err.output;
    if (err.code) code = err.code;
  } else if (err.stack) {
    msg = cleanStack(err.stack);
  }

  // tslint:disable-next-line:no-console
  console.error(msg);
  process.exit(code);
}
