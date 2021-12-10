import crossSpawn from "cross-spawn";

export interface SpawnResult {
  stdout: string;
  stderr: string;
}

export function spawn(
  command: string,
  args: readonly string[] = []
): Promise<SpawnResult> {
  const proc = crossSpawn(command, args);
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
