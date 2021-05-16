import { getResourceModule, Manifest } from "@kosko/yaml";
import camelcase from "camelcase";
import { Component, Import } from "./types";

function jsonStringify(data: unknown): string {
  return JSON.stringify(data, null, "  ");
}

async function generateComponent(manifest: Manifest): Promise<Component> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { apiVersion, kind, ...data } = manifest;
  const name = camelcase(kind);
  const mod = await getResourceModule(manifest);

  if (!mod) {
    return {
      name,
      text: jsonStringify(manifest),
      imports: []
    };
  }

  return {
    name,
    text: `new ${mod.export}(${jsonStringify(data)})`,
    imports: [
      {
        path: mod.path,
        names: [mod.export]
      }
    ]
  };
}

export async function generateForList(
  items: readonly Manifest[]
): Promise<readonly Component[]> {
  const result: Component[] = [];

  for (const data of items) {
    if (data.apiVersion === "v1" && data.kind === "List") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result.push(...(await generateForList(data.items as any)));
    } else {
      result.push(await generateComponent(data));
    }
  }

  return result;
}

export function uniqComponentName(
  components: readonly Component[]
): readonly Component[] {
  const nameMap: { [key: string]: number } = {};

  return components.map((component) => {
    let name = component.name;
    const idx = nameMap[name];

    if (idx) {
      nameMap[name]++;
      name += idx;
    } else {
      nameMap[name] = 1;
    }

    return {
      ...component,
      name
    };
  });
}

export function collectImports(
  components: readonly Component[]
): readonly Import[] {
  const importMap: { [key: string]: Set<string> } = {};

  for (const component of components) {
    for (const { path, names } of component.imports) {
      if (!importMap[path]) importMap[path] = new Set();

      for (const name of names) {
        importMap[path].add(name);
      }
    }
  }

  return Object.keys(importMap).map((path) => ({
    path,
    names: [...importMap[path].values()]
  }));
}
