import { walk } from "https://deno.land/std@0.96.0/fs/mod.ts";
import {
  relative,
  sep,
  globToRegExp
} from "https://deno.land/std@0.96.0/path/mod.ts";
import escapeStringRegExp from "https://cdn.skypack.dev/escape-string-regexp@5.0.0?dts";
import { GlobEntry, GlobOptions } from "../deno_dist/types.ts";

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
