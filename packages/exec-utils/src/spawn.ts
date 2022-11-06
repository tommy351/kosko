import crossSpawn from "cross-spawn";
import { StdioOptions } from "node:child_process";
import assert from "node:assert";
import { SpawnError } from "./error";

/**
 * Output of stdout and stderr. When {@link SpawnOptions.stdio} is set to values
 * other than `pipe`, the result value will be an empty string.
 *
 * @public
 */
export interface SpawnResult {
  stdout: string;
  stderr: string;
}

/**
 * @public
 */
export interface SpawnOptions {
  /**
   * Current working directory (CWD).
   *
   * @defaultValue `process.cwd()`
   */
  cwd?: string;

  /**
   * Environment variables.
   *
   * @defaultValue `process.env`
   */
  env?: Record<string, string>;

  /**
   * @defaultValue `["pipe", "pipe", "pipe"]`
   */
  stdio?: StdioOptions;

  /**
   * Writes data to `stdin`. When this value is given, `stdio[0]` must be `pipe`.
   */
  input?: string;
}

/**
 * Spawns a new child process.
 *
 * @throws {@link SpawnError}
 * Thrown if the process terminates with non-zero exit code.
 *
 * @public
 * @see {@link https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#child_processspawncommand-args-options | Node.js child_process.spawn}
 */
export function spawn(
  command: string,
  args: readonly string[] = [],
  options: SpawnOptions = {}
): Promise<SpawnResult> {
  const proc = crossSpawn(command, args, options);
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  if (options.input) {
    assert(proc.stdin);
    proc.stdin.end(options.input);
  }

  proc.stdout?.on("data", (chunk) => {
    stdoutChunks.push(chunk);
  });

  proc.stderr?.on("data", (chunk) => {
    stderrChunks.push(chunk);
  });

  return new Promise<SpawnResult>((resolve, reject) => {
    proc.on("error", (err) => reject(err));

    proc.on("close", (code) => {
      const stdout = stdoutChunks.join("");
      const stderr = stderrChunks.join("");

      if (code) {
        reject(
          new SpawnError({
            exitCode: code,
            command,
            args,
            stdout,
            stderr
          })
        );
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
