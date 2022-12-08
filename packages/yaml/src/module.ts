import logger, { LogLevel } from "@kosko/log";
import { importModule } from "./import";

/**
 * @public
 */
export interface ResourceModule {
  readonly path: string;
  readonly export: string;
}

/**
 * @public
 */
export interface ResourceKind {
  apiVersion: string;
  kind: string;
}

let moduleMap: Record<string, Record<string, ResourceModule>> = {};

function getGroup(apiVersion: string): string {
  const arr = apiVersion.split("/");
  return arr.length === 1 ? "" : arr[0];
}

/**
 * @public
 */
export function setResourceModule(
  res: ResourceKind,
  mod: ResourceModule
): void {
  const { apiVersion, kind } = res;

  if (!moduleMap[apiVersion]) {
    moduleMap[apiVersion] = {};
  }

  moduleMap[apiVersion][kind] = mod;
  logger.log(LogLevel.Debug, "Set resource module", {
    data: {
      resourceKind: res,
      resourceModule: mod
    }
  });
}

async function getKubernetesModels(
  res: ResourceKind
): Promise<ResourceModule | undefined> {
  const { apiVersion, kind } = res;
  const group = getGroup(apiVersion);

  if (group && group.includes(".") && !group.endsWith(".k8s.io")) {
    return;
  }

  const path = `kubernetes-models/${apiVersion}/${kind}`;

  try {
    const result = await importModule(path);

    if (result?.[kind]) {
      const mod: ResourceModule = { path, export: kind };
      setResourceModule(res, mod);
      return mod;
    }
  } catch {
    return;
  }
}

/**
 * @public
 */
export async function getResourceModule(
  res: ResourceKind
): Promise<ResourceModule | undefined> {
  return (
    moduleMap[res.apiVersion]?.[res.kind] ?? (await getKubernetesModels(res))
  );
}

/**
 * @public
 */
export function resetResourceModules(): void {
  moduleMap = {};
  logger.log(LogLevel.Debug, "Reset resource modules");
}
