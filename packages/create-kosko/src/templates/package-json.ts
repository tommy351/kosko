import logger, { LogLevel } from "@kosko/log";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import stringify from "fast-safe-stringify";
import { EOL } from "node:os";
import { File, TemplateContext } from "./base";
import { getErrorCode } from "@kosko/common-utils";

async function readJson(path: string): Promise<any> {
  try {
    const content = await readFile(path, "utf8");
    return JSON.parse(content);
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
    return {};
  }
}

export async function generatePackageJson(
  ctx: TemplateContext,
  data: Record<string, any> = {}
): Promise<File> {
  const path = join(ctx.path, "package.json");

  logger.log(LogLevel.Debug, `Reading existing package.json from "${path}"`);
  const base = await readJson(path);

  return {
    path: "package.json",
    content:
      stringify(
        {
          ...base,
          ...data,
          scripts: {
            ...base.scripts,
            generate: "kosko generate",
            validate: "kosko validate",
            ...data.scripts
          }
        },
        undefined,
        "  "
      ) + EOL
  };
}
