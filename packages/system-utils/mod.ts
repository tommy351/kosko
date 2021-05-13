import {
  Stats,
  NotFoundError,
  GlobEntry,
  GlobOptions
} from "./deno_dist/types.ts";
import {
  ensureDir,
  exists,
  walk
} from "https://deno.land/std@0.96.0/fs/mod.ts";
import {
  dirname,
  join,
  relative,
  sep,
  globToRegExp
} from "https://deno.land/std@0.96.0/path/mod.ts";
import escapeStringRegExp from "https://cdn.skypack.dev/escape-string-regexp@5.0.0?dts";

export type { Stats, GlobEntry, GlobOptions };
export { NotFoundError, ensureDir, exists as pathExists, join as joinPath };

function handleError(err: any) {
  if (err instanceof Deno.errors.NotFound) {
    return new NotFoundError(err.message);
  }

  return err;
}

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

export async function readDir(path: string): Promise<string[]> {
  const result: string[] = [];

  try {
    for await (const entry of Deno.readDir(path)) {
      result.push(entry.name);
    }
  } catch (err) {
    throw handleError(err);
  }

  return result;
}

export async function stat(path: string): Promise<Stats> {
  try {
    const info = await Deno.stat(path);

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

export async function glob(
  source: string | string[],
  { cwd = Deno.cwd(), onlyFiles = true }: GlobOptions = {}
): Promise<GlobEntry[]> {
  const sources = Array.isArray(source) ? source : [source];
  const entries: GlobEntry[] = [];
  const patternPrefix = escapeStringRegExp(cwd + sep);
  const match = sources
    .map((src) =>
      globToRegExp(src, {
        extended: true,
        globstar: true
      })
    )
    .map(
      (r) => new RegExp(`^${patternPrefix}${r.source.substring(1)}`, r.flags)
    );

  for await (const entry of walk(cwd, { includeDirs: !onlyFiles, match })) {
    entries.push({
      relativePath: relative(cwd, entry.path),
      absolutePath: entry.path
    });
  }

  return entries;
}
