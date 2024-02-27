import type { Manifest } from "../rules/types";
import { apiVersionToGroup } from "@kosko/common-utils";

export interface Predicate {
  apiVersion?: string;
  apiGroup?: string;
  kind?: string;
  namespace?: string;
  name?: string;
}

function getIndexKeys(manifest: Manifest): string[] {
  const metadata = manifest.metadata;
  if (!metadata) return [];

  const keys: string[] = [];

  if (typeof metadata.apiVersion === "string") {
    keys.push(`apiVersion=${metadata.apiVersion}`);
    keys.push(`apiGroup=${apiVersionToGroup(metadata.apiVersion)}`);
  }

  if (typeof metadata.kind === "string") {
    keys.push(`kind=${metadata.kind}`);
  }

  if (typeof metadata.namespace === "string") {
    keys.push(`namespace=${metadata.namespace}`);
  } else {
    keys.push("namespace=");
  }

  if (typeof metadata.name === "string") {
    keys.push(`name=${metadata.name}`);
  }

  return keys;
}

export class ManifestStore {
  private readonly index: Record<string, Set<number>> = {};

  public constructor(private readonly store: readonly Manifest[]) {
    for (let i = 0; i < store.length; i++) {
      for (const key of getIndexKeys(store[i])) {
        this.index[key] ??= new Set();
        this.index[key].add(i);
      }
    }
  }

  public find<T>(predicate: Predicate): Manifest<T> | undefined {
    let result = Array.from({ length: this.store.length }, (_, i) => i);

    for (const [key, value] of Object.entries(predicate)) {
      const indexKey = `${key}=${value ?? ""}`;
      const index = this.index[indexKey];

      if (!index) return;

      result = result.filter((i) => index.has(i));

      if (!result.length) return;
    }

    return this.store[result[0]] as Manifest<T>;
  }

  public forEach(callback: (value: Manifest) => void): void {
    this.store.forEach((value) => callback(value));
  }
}
