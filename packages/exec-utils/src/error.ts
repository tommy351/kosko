/**
 * @public
 */
export interface SpawnErrorOptions {
  exitCode: number;
  command: string;
  args: readonly string[];
  stdout: string;
  stderr: string;
}

/**
 * @public
 */
export class SpawnError extends Error {
  public readonly exitCode: number;
  public readonly command: string;
  public readonly args: readonly string[];
  public readonly stdout: string;
  public readonly stderr: string;

  constructor(options: SpawnErrorOptions) {
    super(
      [
        `Command failed with exit code ${options.exitCode}: ${
          options.command
        } ${options.args.join(" ")}`,
        options.stderr.trim(),
        options.stdout.trim()
      ]
        .filter(Boolean)
        .join("\n")
    );

    this.exitCode = options.exitCode;
    this.command = options.command;
    this.args = options.args;
    this.stdout = options.stdout;
    this.stderr = options.stderr;
  }
}

SpawnError.prototype.name = "SpawnError";
