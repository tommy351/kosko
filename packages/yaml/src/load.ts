import { loadAll } from "js-yaml";
import { readFile } from "node:fs/promises";
import { getResourceModule, ResourceKind } from "./module";
import logger, { LogLevel } from "@kosko/log";
import stringify from "fast-safe-stringify";
import { isRecord } from "@kosko/common-utils";
import { importModule } from "./import";
import fetch from "./fetch";

/**
 * Describes an object which seems to be a Kubernetes manifest.
 *
 * @public
 */
export interface Manifest extends ResourceKind {
  [key: string]: unknown;
}

type ManifestConstructor = new (data: Manifest) => Manifest;

/**
 * @public
 */
export interface LoadOptions {
  transform?(this: void, manifest: Manifest): Manifest | null | undefined;
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
    logger.log(LogLevel.Debug, "No resource modules", {
      data: res
    });
    return;
  }

  try {
    const result = await importModule(mod.path);
    return result[mod.export];
  } catch {
    logger.log(LogLevel.Debug, "Failed to import the resource module", {
      data: mod
    });
    return;
  }
}

/**
 * Loads a Kubernetes YAML file from a string.
 *
 * @public
 */
export async function loadString(
  content: string,
  options: LoadOptions = {}
): Promise<Manifest[]> {
  const { transform = (x) => x } = options;
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
 * Loads a Kubernetes YAML file from `path`.
 *
 * @param path - Path to a Kubernetes YAML file.
 * @public
 */
export function loadFile(path: string, options?: LoadOptions) {
  return async (): Promise<Manifest[]> => {
    const content = await readFile(path, "utf-8");
    logger.log(LogLevel.Debug, `File loaded from: ${path}`);

    return loadString(content, options);
  };
}

/**
 * Loads a Kubernetes YAML file from `url`.
 *
 * @remarks
 * By default, this function uses `fetch` API defined in the global scope.
 * On Node.js, if `global.fetch` is undefined, {@link https://github.com/node-fetch/node-fetch | node-fetch}
 * will be used instead.
 *
 * @param url - URL to a Kubernetes YAML file.
 * @param options - {@link LoadOptions} and properties defined in {@link https://developer.mozilla.org/en-US/docs/Web/API/Request | Request} class.
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
