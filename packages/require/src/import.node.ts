import { getErrorCode } from "@kosko/common-utils";
import { createRequire } from "node:module";
import { env } from "node:process";
import { pathToFileURL } from "node:url";

const ESM_IMPORT_DISABLED = env.ESM_IMPORT_DISABLED === "1";

const req =
  // eslint-disable-next-line no-restricted-globals
  process.env.BUILD_FORMAT === "cjs" ? require : createRequire(import.meta.url);

function requireModule(path: string) {
  const mod = req(path);
  return mod && mod.__esModule ? mod : { default: mod };
}

export async function importPath(path: string) {
  if (ESM_IMPORT_DISABLED) {
    return requireModule(path);
  }

  const url = pathToFileURL(path).toString();

  if (path.endsWith(".json")) {
    // Fix `ERR_IMPORT_ASSERTION_TYPE_MISSING` error when importing `.json` files
    // in CJS mode.
    // eslint-disable-next-line no-restricted-globals
    if (process.env.BUILD_FORMAT === "cjs") {
      return requireModule(path);
    }

    return import(url, { assert: { type: "json" } });
  }

  try {
    return await import(url);
  } catch (err) {
    // This might happen when importing `.ts` files.
    if (getErrorCode(err) !== "ERR_UNKNOWN_FILE_EXTENSION") {
      throw err;
    }

    return requireModule(path);
  }
}
