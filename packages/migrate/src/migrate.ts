import { Manifest, loadString } from "@kosko/yaml";
import { Component, MigrateFormat, MigrateOptions } from "./types";
import { collectImports, generateForList, uniqComponentName } from "./utils";

let defaultFormat: MigrateFormat = MigrateFormat.CJS;

export function setDefaultFormat(format: MigrateFormat): void {
  defaultFormat = format;
}

function generateCJS(components: readonly Component[]): string {
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

function generateESM(components: readonly Component[]): string {
  let output = "";

  for (const { path, names } of collectImports(components)) {
    output += `import { ${names.join(", ")} } from "${path}";\n`;
  }

  for (const { name, text } of components) {
    output += `\nconst ${name} = ${text};\n`;
  }

  output += `\nexport default [${components.map((c) => c.name).join(", ")}];\n`;

  return output;
}

/**
 * Migrate Kubernetes manifests into a kosko component.
 *
 * @param data Array of Kubernetes manifests
 */
export async function migrate(
  data: readonly Manifest[],
  { format = defaultFormat }: MigrateOptions = {}
): Promise<string> {
  const components = uniqComponentName(await generateForList(data));

  switch (format) {
    case MigrateFormat.CJS:
      return generateCJS(components);
    case MigrateFormat.ESM:
      return generateESM(components);
    default:
      throw new Error(`Format "${format}" is not supported.`);
  }
}

/**
 * Migrate Kubernetes YAML into a kosko component.
 *
 * @param input Kubernetes YAML string
 */
export async function migrateString(
  input: string,
  options?: MigrateOptions
): Promise<string> {
  return migrate(await loadString(input), options);
}
