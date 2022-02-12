import exit from "exit";
import logger, { LogLevel } from "@kosko/log";

export class CLIError extends Error {
  public readonly name = "CLIError";
  public readonly output?: string;
  public readonly code?: number;

  public constructor(
    msg: string,
    { output, code }: { output?: string; code?: number } = {}
  ) {
    super(msg);
    this.output = output;
    this.code = code;
  }
}

export function handleError(err: unknown): void {
  let code = 1;

  if (err instanceof CLIError) {
    if (err.code != null) {
      code = err.code;
    }

    if (err.output) {
      logger.log(LogLevel.Error, err.output);
    } else {
      logger.log(LogLevel.Error, err.message, { error: err });
    }
  } else if (err instanceof Error) {
    if (err.name !== "YError") {
      logger.log(LogLevel.Error, "", { error: err });
    }
  } else {
    logger.log(LogLevel.Error, "", { error: err });
  }

  exit(code);
}
