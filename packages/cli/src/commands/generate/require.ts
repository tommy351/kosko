import {
  resolve,
  requireDefault,
  importPath,
  resolveESM
} from "@kosko/require";
import logger, { LogLevel } from "@kosko/log";
import { isRecord } from "@kosko/common-utils";

export async function localRequireDefault(
  id: string,
  cwd: string
): Promise<any> {
  const path = await resolve(id, { baseDir: cwd });

  logger.log(LogLevel.Debug, `Importing ${id} from ${path}`);
  return requireDefault(path);
}

export async function localImportDefault(
  id: string,
  cwd: string
): Promise<any> {
  const path = await resolveESM(id, {
    baseDir: cwd
  });

  logger.log(LogLevel.Debug, `Importing ${id} from ${path}`);

  const mod = await importPath(path);

  if (isRecord(mod)) {
    return mod.default;
  }

  return mod;
}
