import crossSpawn from "cross-spawn";
import { StdioOptions } from "node:child_process";
import assert from "node:assert";
import { SpawnError } from "./error";

/**
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
  cwd?: string;
  env?: Record<string, string>;
  stdio?: StdioOptions;
  input?: string;
}

/**
 * @public
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

  proc.stdout?.on("data", (chunk: string) => {
    stdoutChunks.push(chunk);
  });

  proc.stderr?.on("data", (chunk: string) => {
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
