import crossSpawn from "cross-spawn";
import { StdioOptions } from "child_process";

export interface SpawnResult {
  stdout: string;
  stderr: string;
}

export interface SpawnOptions {
  cwd?: string;
  env?: Record<string, string>;
  stdio?: StdioOptions;
}

export function spawn(
  command: string,
  args: readonly string[] = [],
  options?: SpawnOptions
): Promise<SpawnResult> {
  const proc = crossSpawn(command, args, options);
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

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
          new Error(
            [
              `Command failed with exit code ${code}: ${command} ${args.join(
                " "
              )}`,
              stderr.trim(),
              stdout.trim()
            ]
              .filter(Boolean)
              .join("\n")
          )
        );
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
