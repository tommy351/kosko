import { SpawnResult } from "../deno_dist/types.ts";

export async function spawn(
  command: string,
  args: readonly string[]
): Promise<SpawnResult> {
  const p = Deno.run({
    cmd: [command, ...args],
    stdout: "piped",
    stderr: "piped"
  });

  const [{ code }, stdoutOutput, stderrOutput] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput()
  ]);

  const stdout = new TextDecoder().decode(stdoutOutput);
  const stderr = new TextDecoder().decode(stderrOutput);

  if (code) {
    throw new Error(
      [
        `Command failed with exit code ${code}: ${command} ${args.join(" ")}`,
        stderr,
        stdout
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

  return { stdout, stderr };
}
