import "./deno/polyfill.ts";

import {
  Stats,
  NotFoundError,
  GlobEntry,
  GlobOptions
} from "./deno_dist/types.ts";
import {
  ensureDir,
  exists,
  walk,
  WalkOptions
} from "https://deno.land/std@0.96.0/fs/mod.ts";
import {
  dirname,
  join,
  relative,
  sep
} from "https://deno.land/std@0.96.0/path/mod.ts";
import micromatch from "https://cdn.skypack.dev/micromatch@4.0.4?dts";
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
  const patternPrefix = escapeStringRegExp(cwd + sep);
  const parsedPatterns: any[] = sources.map((src) =>
    micromatch.parse(src, { cwd })
  );
  const match: RegExp[] = [];
  const skip: RegExp[] = [];
  const entries: GlobEntry[] = [];

  for (const [parsed] of parsedPatterns) {
    const pattern = new RegExp(`^${patternPrefix}(?:${parsed.output})$`);

    if (parsed.negated) {
      skip.push(pattern);
    } else {
      match.push(pattern);
    }
  }

  const walkOptions: WalkOptions = {
    includeDirs: !onlyFiles,
    ...(match.length && { match }),
    ...(skip.length && { skip })
  };

  for await (const entry of walk(cwd, walkOptions)) {
    entries.push({
      relativePath: relative(cwd, entry.path),
      absolutePath: entry.path
    });
  }

  return entries;
}
