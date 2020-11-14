import { safeLoadAll } from "js-yaml";
import fs from "fs";
import { promisify } from "util";
import fetch, { RequestInfo, RequestInit } from "node-fetch";
import { getResourceModule, ResourceKind } from "./module";
import Debug from "./debug";

const debug = Debug.extend("load");
const readFile = promisify(fs.readFile);

export interface Manifest extends ResourceKind {
  [key: string]: unknown;
}

type ManifestConstructor = new (data: Manifest) => Manifest;

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

function getConstructor(res: ResourceKind): ManifestConstructor | undefined {
  const mod = getResourceModule(res);

  if (!mod) {
    debug("No resource modules for", res);
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(mod.path)[mod.export];
  } catch {
    debug("Failed to import the resource module", mod);
    return;
  }
}

/**
 * Load a Kubernetes YAML file from a string.
 */
export function loadString(content: string): ReadonlyArray<Manifest> {
  const input = safeLoadAll(content).filter((x) => x != null);
  const manifests: Manifest[] = [];

  for (const entry of input) {
    if (!isRecord(entry)) {
      throw new Error(`The value must be an object: ${JSON.stringify(entry)}`);
    }

    if (!isManifest(entry)) {
      throw new Error(
        `apiVersion and kind are required: ${JSON.stringify(entry)}`
      );
    }

    const Constructor = getConstructor(entry);
    manifests.push(Constructor ? new Constructor(entry) : entry);
  }

  return manifests;
}

/**
 * Load a Kubernetes YAML file from path.
 *
 * @param path Path to the Kubernetes YAML file.
 */
export function loadFile(path: string) {
  return async (): Promise<ReadonlyArray<Manifest>> => {
    const content = await readFile(path, "utf-8");
    debug("File loaded from: %s", path);

    return loadString(content);
  };
}

/**
 * Load a Kubernetes YAML file from url.
 *
 * @param url URL to the Kubernetes YAML file.
 * @param init [Options](https://github.com/node-fetch/node-fetch#options) for the HTTP(S) request.
 */
export function loadUrl(url: RequestInfo, init?: RequestInit) {
  return async (): Promise<ReadonlyArray<Manifest>> => {
    const res = await fetch(url, init);
    debug(`Fetch "%s": status=%d`, url, res.status);

    if (!res.ok) {
      throw new Error(`Failed to fetch YAML file from: ${url}`);
    }

    return loadString(await res.text());
  };
}
