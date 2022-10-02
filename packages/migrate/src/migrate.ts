import camelcase from "camelcase";
import { Manifest, loadString, getResourceModule } from "@kosko/yaml";

export type { Manifest };

interface Component {
  readonly name: string;
  readonly text: string;
  readonly imports: readonly Import[];
}

interface Import {
  readonly names: readonly string[];
  readonly path: string;
}

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

async function generateForList(
  items: readonly Manifest[]
): Promise<Component[]> {
  const result: Component[] = [];

  for (const data of items) {
    if (data.apiVersion === "v1" && data.kind === "List") {
      result.push(...(await generateForList(data.items as any)));
    } else {
      result.push(await generateComponent(data));
    }
  }

  return result;
}

function uniqComponentName(components: readonly Component[]): Component[] {
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

function collectImports(components: readonly Component[]): Import[] {
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

/**
 * Migrate Kubernetes manifests into a kosko component.
 *
 * @param data Array of Kubernetes manifests
 */
export async function migrate(data: readonly Manifest[]): Promise<string> {
  const components = uniqComponentName(await generateForList(data));
  let output = `"use strict";\n\n`;

  for (const { path, names } of collectImports(components)) {
    output += `const { ${names.join(", ")} } = require("${path}");\n`;
  }

  for (const { name, text } of components) {
    output += `\nconst ${name} = ${text};\n`;
  }

  output += `\nmodule.exports = [${components
    .map((c) => c.name)
    .join(", ")}];\n`;

  return output;
}

/**
 * Migrate Kubernetes YAML into a kosko component.
 *
 * @param input Kubernetes YAML string
 */
export async function migrateString(input: string): Promise<string> {
  return migrate(await loadString(input));
}
