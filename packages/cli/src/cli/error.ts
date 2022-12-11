import logger, { LogLevel } from "@kosko/log";
import { exit } from "node:process";

export class CLIError extends Error {
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

CLIError.prototype.name = "CLIError";

/**
 * Handles errors thrown by {@link run} function.
 *
 * @remarks
 * This function prints error message to logger and terminates current process
 * with status code specified in `err` object.
 *
 * @example
 * ```ts
 * run().catch(handleError);
 * ```
 *
 * @public
 */
export function handleError(err: unknown): void {
  let code = 1;

  if (err instanceof CLIError) {
    if (err.code != null) {
      code = err.code;
    }

    if (typeof err.output === "string") {
      if (err.output) {
        logger.log(LogLevel.Error, err.output);
      }
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
