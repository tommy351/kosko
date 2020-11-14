import { safeLoadAll } from "js-yaml";
import fs from "fs";
import { promisify } from "util";

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

/**
 * Load a Kubernetes YAML file from path.
 *
 * @param path Path to the Kubernetes YAML file.
 */
export function loadFile(path: string) {
  return async (): Promise<ReadonlyArray<unknown>> => {
    const content = await readFile(path, "utf-8");
    return validate(safeLoadAll(content));
  };
}
