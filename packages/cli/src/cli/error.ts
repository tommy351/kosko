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
  let logError = true;

  if (err instanceof CLIError) {
    if (err.code != null) {
      code = err.code;
    }

    if (err.output) {
      logError = false;
      logger.log(LogLevel.Error, err.output);
    }
  } else if (err instanceof Error && err.name === "YError") {
    logError = false;
  }

  if (logError) {
    logger.log(LogLevel.Error, (err as any)?.message || "CLI error", {
      error: err
    });
  }

  exit(code);
}
