import {
  resolve,
  requireDefault,
  importPath,
  resolveESM
} from "@kosko/require";
import debug from "./debug";

export async function localRequireDefault(
  id: string,
  cwd: string
): Promise<any> {
  const path = await resolve(id, { baseDir: cwd });

  if (!path) {
    throw new Error(`Cannot find module "${id}"`);
  }

  debug("Importing %s from %s", id, path);
  return requireDefault(path);
}

export async function localImportDefault(
  id: string,
  cwd: string
): Promise<any> {
  const path = await resolveESM(id, {
    baseDir: cwd
  });

  if (!path) {
    throw new Error(`Cannot find module "${id}"`);
  }

  debug("Importing %s from %s", id, path);
  const mod = await importPath(path);
  return mod.default;
}
