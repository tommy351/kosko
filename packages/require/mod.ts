import { createRequire } from "https://deno.land/std@0.96.0/node/module.ts";
import {
  join,
  isAbsolute,
  toFileUrl
} from "https://deno.land/std@0.96.0/path/mod.ts";
import type mod from "./index.d.ts";

const require = createRequire(import.meta.url);

export const isESMSupported: typeof mod.isESMSupported = async () => true;

export const importPath: typeof mod.importPath = (path) => {
  return import(toFileUrl(path).toString());
};

export const requireDefault: typeof mod.requireDefault = (path) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path);
  return mod && mod.__esModule ? mod.default : mod;
};

async function tryStat(path: string): Promise<Deno.FileInfo | undefined> {
  try {
    return await Deno.stat(path);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return;
    throw err;
  }
}

export const resolve: typeof mod.resolve = async (
  id,
  { baseDir = Deno.cwd(), extensions = getRequireExtensions() } = {}
) => {
  const absId = isAbsolute(id) ? id : join(baseDir, id);
  const possiblePaths = [
    // Without file extension
    absId,
    // With file extension
    ...extensions.map((ext) => absId + ext),
    // Directory index
    ...extensions.map((ext) => join(absId, "index" + ext))
  ];

  for (const path of possiblePaths) {
    const stats = await tryStat(path);

    if (stats?.isFile) {
      return path;
    }
  }

  throw new Error(`Cannot find module "${id}".`);
};

export const resolveESM: typeof mod.resolveESM = resolve;

export const getRequireExtensions: typeof mod.getRequireExtensions = () => [
  ".ts",
  ".tsx",
  ".js",
  ".jsx"
];

export type { ResolveOptions } from "./index.d.ts";
