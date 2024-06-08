import { BUILD_FORMAT } from "@kosko/build-scripts";
import { getErrorCode } from "@kosko/common-utils";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const req = BUILD_FORMAT === "cjs" ? require : createRequire(import.meta.url);

function requireModule(path: string) {
  const mod = req(path);
  return mod && mod.__esModule ? mod : { default: mod };
}

export async function importPath(path: string) {
  const url = pathToFileURL(path).toString();

  if (path.endsWith(".json")) {
    // Fix `ERR_IMPORT_ASSERTION_TYPE_MISSING` error when importing `.json` files
    // in CJS mode.
    if (BUILD_FORMAT === "cjs") {
      return requireModule(path);
    }

    return import(url, { assert: { type: "json" }, with: { type: "json" } });
  }

  try {
    return await import(url);
  } catch (err) {
    const code = getErrorCode(err);

    if (
      // This might happen when importing `.ts` files.
      code === "ERR_UNKNOWN_FILE_EXTENSION" ||
      // This might happen when importing ESM files in CJS mode.
      code === "ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG"
    ) {
      return requireModule(path);
    }

    throw err;
  }
}
