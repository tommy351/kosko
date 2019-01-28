import yaml from "js-yaml";
import camelcase from "camelcase";
import { getImportPath } from "kubernetes-models/resolve";

export interface Manifest {
  apiVersion: string;
  kind: string;
  [key: string]: any;
}

interface Component {
  name: string;
  text: string;
  imports: ReadonlyArray<Import>;
}

interface Import {
  names: ReadonlyArray<string>;
  path: string;
}

function jsonStringify(data: any): string {
  return JSON.stringify(data, null, "  ");
}

function generateComponent(manifest: Manifest): Component {
  const { apiVersion, kind, ...data } = manifest;
  const name = camelcase(kind);
  const importPath = getImportPath(apiVersion, kind);

  if (!importPath) {
    return {
      name,
      text: jsonStringify(manifest),
      imports: []
    };
  }

  return {
    name,
    text: `new ${kind}(${jsonStringify(data)})`,
    imports: [
      {
        path: "kubernetes-models/" + importPath,
        names: [kind]
      }
    ]
  };
}

function validateManifest(data: any): data is Manifest {
  return typeof data.apiVersion === "string" && typeof data.kind === "string";
}

function generateForList(
  items: ReadonlyArray<unknown>
): ReadonlyArray<Component> {
  return items
    .map(data => {
      if (!validateManifest(data)) {
        throw new Error("apiVersion and kind is required");
      }
      if (data.apiVersion === "v1" && data.kind === "List") {
        return generateForList(data.items);
      }

      return generateComponent(data);
    })
    .reduce((acc: Component[], x) => acc.concat(x), []);
}

function uniqComponentName(
  components: ReadonlyArray<Component>
): ReadonlyArray<Component> {
  const nameMap: { [key: string]: number } = {};

  return components.map(component => {
    let name = component.name;

    if (nameMap[name]) {
      name += nameMap[name];
      nameMap[name]++;
    } else {
      nameMap[name] = 1;
    }

    return {
      ...component,
      name
    };
  });
}

function collectImports(
  components: ReadonlyArray<Component>
): ReadonlyArray<Import> {
  const importMap: { [key: string]: Set<string> } = {};

  for (const component of components) {
    for (const { path, names } of component.imports) {
      if (!importMap[path]) importMap[path] = new Set();

      for (const name of names) {
        importMap[path].add(name);
      }
    }
  }

  return Object.keys(importMap).map(path => ({
    path,
    names: [...importMap[path].values()]
  }));
}

export function migrate(data: ReadonlyArray<Manifest>): string {
  const components = uniqComponentName(generateForList(data));
  let output = `"use strict";\n\n`;

  for (const { path, names } of collectImports(components)) {
    output += `const { ${names.join(", ")} } = require("${path}");\n`;
  }

  for (const { name, text } of components) {
    output += `\nconst ${name} = ${text};\n`;
  }

  output += `\nmodule.exports = [${components.map(c => c.name).join(", ")}];\n`;

  return output;
}

export function migrateString(input: string) {
  return migrate(yaml.safeLoadAll(input));
}
