import camelcase from "camelcase";
import { Manifest, loadString, getResourceModule } from "@kosko/yaml";
import stringify from "fast-safe-stringify";

/**
 * @public
 */
export enum MigrateFormat {
  /**
   * CommonJS.
   */
  CJS = "cjs",

  /**
   * ECMAScript modules (ESM).
   */
  ESM = "esm"
}

/**
 * @public
 */
export interface MigrateOptions {
  /**
   * Output format.
   *
   * @defaultValue Node.js `cjs`
   * @defaultValue Others `esm`
   */
  format?: MigrateFormat;
}

const DEFAULT_FORMAT: MigrateFormat =
  // eslint-disable-next-line no-restricted-globals
  process.env.BUILD_TARGET === "node" ? MigrateFormat.CJS : MigrateFormat.ESM;

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
  return stringify(data, undefined, "  ");
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
    if (
      data.apiVersion === "v1" &&
      data.kind === "List" &&
      Array.isArray(data.items)
    ) {
      result.push(...(await generateForList(data.items)));
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
 * Migrate Kubernetes manifests into a Kosko component.
 *
 * @param data - Array of Kubernetes manifests
 * @public
 */
export async function migrate(
  data: readonly Manifest[],
  options: MigrateOptions = {}
): Promise<string> {
  const { format = DEFAULT_FORMAT } = options;
  const components = uniqComponentName(await generateForList(data));
  let output = "";

  if (format === MigrateFormat.CJS) {
    output += `"use strict";\n\n`;
  }

  for (const { path, names } of collectImports(components)) {
    if (format === MigrateFormat.CJS) {
      output += `const { ${names.join(", ")} } = require("${path}");\n`;
    } else {
      output += `import { ${names.join(", ")} } from "${path}";\n`;
    }
  }

  for (const { name, text } of components) {
    output += `\nconst ${name} = ${text};\n`;
  }

  const names = components.map((c) => c.name).join(", ");

  if (format === MigrateFormat.CJS) {
    output += `\nmodule.exports = [${names}];\n`;
  } else {
    output += `\nexport default [${names}];\n`;
  }

  return output;
}

/**
 * Migrate Kubernetes YAML into a kosko component.
 *
 * @param input - Kubernetes YAML string
 * @public
 */
export async function migrateString(
  input: string,
  options?: MigrateOptions
): Promise<string> {
  return migrate(await loadString(input), options);
}

export { type Manifest } from "@kosko/yaml";
