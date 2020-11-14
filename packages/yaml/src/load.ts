import { safeLoadAll } from "js-yaml";
import fs from "fs";
import { promisify } from "util";
import fetch, { RequestInfo, RequestInit } from "node-fetch";

const readFile = promisify(fs.readFile);

function validate(input: unknown): unknown[] {
  const arr = ([] as any[]).concat(input).filter((x) => x != null);

  for (const entry of arr) {
    if (typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`The value must be an object: ${JSON.stringify(entry)}`);
    }

    if (
      typeof entry.apiVersion !== "string" ||
      !entry.apiVersion ||
      typeof entry.kind !== "string" ||
      !entry.kind
    ) {
      throw new Error(
        `apiVersion and kind are required: ${JSON.stringify(entry)}`
      );
    }
  }

  return arr;
}

function loadYAMLString(input: string): ReadonlyArray<unknown> {
  return validate(safeLoadAll(input));
}

/**
 * Load a Kubernetes YAML file from path.
 *
 * @param path Path to the Kubernetes YAML file.
 */
export function loadFile(path: string) {
  return async (): Promise<ReadonlyArray<unknown>> => {
    const content = await readFile(path, "utf-8");
    return loadYAMLString(content);
  };
}

/**
 * Load a Kubernetes YAML file from url.
 *
 * @param url URL to the Kubernetes YAML file.
 * @param init [Options](https://github.com/node-fetch/node-fetch#options) for the HTTP(S) request.
 */
export function loadUrl(url: RequestInfo, init?: RequestInit) {
  return async (): Promise<ReadonlyArray<unknown>> => {
    const res = await fetch(url, init);

    if (!res.ok) {
      throw new Error(`Failed to fetch YAML file from: ${url}`);
    }

    return loadYAMLString(await res.text());
  };
}
