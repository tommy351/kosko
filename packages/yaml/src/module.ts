import Debug from "./debug";
import { requireNamedExport } from "@kosko/require";

const debug = Debug.extend("module");

export interface ResourceModule {
  readonly path: string;
  readonly export: string;
}

export interface ResourceKind {
  readonly apiVersion: string;
  readonly kind: string;
}

let moduleMap: Record<string, Record<string, ResourceModule>> = {};

function getGroup(apiVersion: string): string {
  const arr = apiVersion.split("/");
  return arr.length === 1 ? "" : arr[0];
}

export function setResourceModule(
  res: ResourceKind,
  mod: ResourceModule
): void {
  const { apiVersion, kind } = res;

  if (!moduleMap[apiVersion]) {
    moduleMap[apiVersion] = {};
  }

  moduleMap[apiVersion][kind] = mod;
  debug("Set resource module", res, mod);
}

async function getKubernetesModels(
  res: ResourceKind
): Promise<ResourceModule | undefined> {
  const { apiVersion, kind } = res;
  const group = getGroup(apiVersion);

  if (group && group.includes(".") && !group.endsWith(".k8s.io")) {
    return;
  }

  try {
    const path = `kubernetes-models/${apiVersion}/${kind}`;
    const ctor = requireNamedExport(path, kind);

    if (ctor) {
      const mod: ResourceModule = { path, export: kind };
      setResourceModule(res, mod);
      return mod;
    }
  } catch {
    return;
  }
}

export async function getResourceModule(
  res: ResourceKind
): Promise<ResourceModule | undefined> {
  return (
    moduleMap[res.apiVersion]?.[res.kind] ?? (await getKubernetesModels(res))
  );
}

export function resetResourceModules(): void {
  moduleMap = {};
  debug("Reset resource modules");
}
