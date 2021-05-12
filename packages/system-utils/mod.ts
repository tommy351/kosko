import { Stats, NotFoundError } from "./deno_dist/types.ts";
import { ensureDir } from "https://deno.land/std@0.96.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.96.0/path/mod.ts";

export type { Stats };
export { NotFoundError, ensureDir };

function handleError(err: any) {
  if (err instanceof Deno.errors.NotFound) {
    return new NotFoundError(err.message);
  }

  return err;
}

export function cwd(): string {
  return Deno.cwd();
}

export async function readFile(src: string): Promise<string> {
  try {
    return await Deno.readTextFile(src);
  } catch (err) {
    throw handleError(err);
  }
}

export async function writeFile(dest: string, data: string): Promise<void> {
  await ensureDir(path.dirname(dest));

  try {
    await Deno.writeTextFile(dest, data);
  } catch (err) {
    throw handleError(err);
  }
}

export async function readDir(src: string): Promise<string[]> {
  const result: string[] = [];

  try {
    for await (const entry of Deno.readDir(src)) {
      result.push(entry.name);
    }
  } catch (err) {
    throw handleError(err);
  }

  return result;
}

export async function stat(src: string): Promise<Stats> {
  try {
    const info = await Deno.stat(src);

    return {
      isFile: info.isFile,
      isDirectory: info.isDirectory,
      isSymbolicLink: info.isSymlink,
      size: info.size
    };
  } catch (err) {
    throw handleError(err);
  }
}

export function joinPath(...paths: string[]): string {
  return path.join(...paths);
}
