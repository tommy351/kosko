import {
  Stats,
  NotFoundError,
  GlobEntry,
  GlobOptions,
  SpawnResult
} from "./deno_dist/types.ts";
import { ensureDir, exists } from "https://deno.land/std@0.96.0/fs/mod.ts";
import { dirname, join } from "https://deno.land/std@0.96.0/path/mod.ts";
import { handleError } from "./deno/utils.ts";

export { readDir } from "./deno/readDir.ts";
export { stat } from "./deno/stat.ts";
export { glob } from "./deno/glob.ts";
export { spawn } from "./deno/spawn.ts";

export type { Stats, GlobEntry, GlobOptions, SpawnResult };
export { NotFoundError, ensureDir, exists as pathExists, join as joinPath };

export function cwd(): string {
  return Deno.cwd();
}

export async function readFile(path: string): Promise<string> {
  try {
    return await Deno.readTextFile(path);
  } catch (err) {
    throw handleError(err);
  }
}

export async function writeFile(path: string, data: string): Promise<void> {
  await ensureDir(dirname(path));

  try {
    await Deno.writeTextFile(path, data);
  } catch (err) {
    throw handleError(err);
  }
}

export async function makeTempFile(): Promise<string> {
  return Deno.makeTempFile();
}

export async function remove(path: string): Promise<void> {
  try {
    await Deno.remove(path);
  } catch (err) {
    throw handleError(err);
  }
}
