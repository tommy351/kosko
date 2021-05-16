import { GlobEntry, GlobOptions } from "./types";
import fastGlob from "fast-glob";
import p from "path";

export async function glob(
  source: string | string[],
  { cwd = process.cwd(), onlyFiles = true }: GlobOptions = {}
): Promise<GlobEntry[]> {
  const paths = await fastGlob(source, { cwd, onlyFiles });

  return paths.map((path) => ({
    relativePath: path,
    absolutePath: p.join(cwd, path)
  }));
}
