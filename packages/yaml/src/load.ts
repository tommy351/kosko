import { loadAll } from "js-yaml";
import fs from "node:fs/promises";
import fetch, { RequestInfo, RequestInit } from "node-fetch";
import { getResourceModule, ResourceKind } from "./module";
import logger, { LogLevel } from "@kosko/log";
import { importPath } from "@kosko/require";
import stringify from "fast-safe-stringify";

/**
 * @public
 */
export interface Manifest extends ResourceKind {
  [key: string]: any;
}

type ManifestConstructor = new (data: Manifest) => Manifest;

/**
 * @public
 */
export interface LoadOptions {
  transform?(manifest: Manifest): Manifest | null | undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && !Array.isArray(value);
}

function isManifest(value: Record<string, unknown>): value is Manifest {
  return (
    typeof value.apiVersion === "string" &&
    !!value.apiVersion &&
    typeof value.kind === "string" &&
    !!value.kind
  );
}

async function getConstructor(
  res: ResourceKind
): Promise<ManifestConstructor | undefined> {
  const mod = await getResourceModule(res);

  if (!mod) {
    logger.log(LogLevel.Debug, `No resource modules`, {
      data: res
    });
    return;
  }

  try {
    const result = await importPath(mod.path);
    return result[mod.export];
  } catch {
    logger.log(LogLevel.Debug, "Failed to import the resource module", {
      data: mod
    });
    return;
  }
}

/**
 * Load a Kubernetes YAML file from a string.
 *
 * @public
 */
export async function loadString(
  content: string,
  { transform = (x) => x }: LoadOptions = {}
): Promise<Manifest[]> {
  const input = loadAll(content).filter((x) => x != null);
  const manifests: Manifest[] = [];

  for (const entry of input) {
    if (!isRecord(entry)) {
      throw new Error(`The value must be an object: ${stringify(entry)}`);
    }

    if (!isManifest(entry)) {
      throw new Error(`apiVersion and kind are required: ${stringify(entry)}`);
    }

    const Constructor = await getConstructor(entry);
    const manifest = transform(Constructor ? new Constructor(entry) : entry);

    if (manifest) {
      manifests.push(manifest);
    }
  }

  return manifests;
}

/**
 * Load a Kubernetes YAML file from path.
 *
 * @param path - Path to the Kubernetes YAML file.
 * @public
 */
export function loadFile(path: string, options?: LoadOptions) {
  return async (): Promise<Manifest[]> => {
    const content = await fs.readFile(path, "utf-8");
    logger.log(LogLevel.Debug, `File loaded from: ${path}`);

    return loadString(content, options);
  };
}

/**
 * Load a Kubernetes YAML file from url.
 *
 * @param url - URL to the Kubernetes YAML file.
 * @param options - [Options](https://github.com/node-fetch/node-fetch#options) for the HTTP(S) request.
 * @public
 */
export function loadUrl(
  url: RequestInfo,
  options: LoadOptions & RequestInit = {}
): () => Promise<Manifest[]> {
  const { transform, ...init } = options;

  return async () => {
    const res = await fetch(url, init);
    logger.log(LogLevel.Debug, `Fetched YAML`, {
      data: { url, status: res.status }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch YAML file from: ${url}`);
    }

    return loadString(await res.text(), { transform });
  };
}
