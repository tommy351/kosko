import logger, { LogLevel } from "@kosko/log";
import { join } from "node:path";
import fs from "node:fs/promises";
import stringify from "fast-safe-stringify";
import os from "node:os";
import { File, TemplateContext } from "./base";
import { getErrorCode, isRecord } from "@kosko/utils";
import { CLIError } from "../../../cli/error";

async function readJson(path: string): Promise<unknown> {
  try {
    const content = await fs.readFile(path, "utf8");
    return JSON.parse(content) as unknown;
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
    return {};
  }
}

export async function generatePackageJson(
  ctx: TemplateContext,
  data: {
    scripts?: Record<string, string>;
    [key: string]: unknown;
  } = {}
): Promise<File> {
  const path = join(ctx.path, "package.json");

  logger.log(LogLevel.Debug, `Reading existing package.json from "${path}"`);
  const base = await readJson(path);

  if (!isRecord(base)) {
    throw new CLIError("Content of package.json must be an object");
  }

  if (base.scripts != null && !isRecord(base.scripts)) {
    throw new CLIError(`"scripts" in package.json must be an object`);
  }

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
      ) + os.EOL
  };
}
