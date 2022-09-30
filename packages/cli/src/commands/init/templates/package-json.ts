import logger, { LogLevel } from "@kosko/log";
import { join } from "path";
import fs from "fs/promises";
import { File, TemplateContext } from "./base";

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  [key: string]: any;
}

async function readJson(path: string): Promise<any> {
  try {
    const content = await fs.readFile(path, "utf8");
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
    return {};
  }
}

function sortKeys<T extends Record<string, unknown>>(data: T): T {
  const result: any = {};

  for (const key of Object.keys(data).sort()) {
    result[key] = data[key];
  }

  return result;
}

function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

export function mergePackageJson(
  base: PackageJson,
  data: PackageJson
): PackageJson {
  const merged = { ...base, ...data };
  const scripts = { ...base.scripts, ...data.scripts };

  if (!isEmptyObject(scripts)) {
    merged.scripts = scripts;
  }

  // Merge and sort dependencies
  for (const key of ["dependencies", "devDependencies"]) {
    const deps = sortKeys({ ...base[key], ...data[key] });

    if (!isEmptyObject(deps)) {
      merged[key] = deps;
    }
  }

  return merged;
}

export async function generatePackageJson(
  ctx: TemplateContext,
  data: PackageJson = {}
): Promise<File> {
  const path = join(ctx.path, "package.json");

  logger.log(LogLevel.Debug, `Reading existing package.json from "${path}"`);
  const base = await readJson(path);

  return {
    path: "package.json",
    content: JSON.stringify(
      mergePackageJson(
        mergePackageJson(base, {
          scripts: {
            generate: "kosko generate",
            validate: "kosko validate"
          },
          dependencies: {
            "@kosko/env": "^3.0.0",
            kosko: "^2.0.0",
            "kubernetes-models": "^3.0.0"
          }
        }),
        data
      ),
      null,
      "  "
    )
  };
}
