import { ResourcePosition } from "./resource-map";

export interface LintErrorOptions {
  position: ResourcePosition;
}

export class LintError extends Error {
  private readonly position: ResourcePosition;

  public constructor(msg: string, options: LintErrorOptions) {
    super(msg);

    this.position = options.position;

    // TODO: Add position to the message & stack
  }
}

LintError.prototype.name = "LintError";
