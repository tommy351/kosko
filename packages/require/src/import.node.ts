import { getErrorCode } from "@kosko/common-utils";
import { createRequire } from "node:module";
import { env, version as nodeVersion } from "node:process";
import { pathToFileURL } from "node:url";

const ESM_IMPORT_DISABLED = env.ESM_IMPORT_DISABLED === "1";

/**
 * Node.js supports import assertions since v16.14.0, v17.1.0.
 */
function getImportAssertionsSupported(): boolean {
  const [major, minor] = nodeVersion
    .substring(1)
    .split(".")
    .map((x) => parseInt(x, 10));

  switch (major) {
    case 16:
      return minor >= 14;
    case 17:
      return minor >= 1;
    default:
      return major >= 18;
  }
}

async function importDefault(id: string) {
  const mod = await import(id);
  return mod.default;
}

type ImportWithOpts = (id: string, opts: ImportCallOptions) => any;

/**
 * On older version of Node.js, `import()` with more than one parameter will
 * throw an error. That's why we move `import()` call to another file and
 * determine whether to use it or not based on Node.js version.
 */
const importWithOpts = (async (): Promise<ImportWithOpts | undefined> => {
  if (!ESM_IMPORT_DISABLED && getImportAssertionsSupported()) {
    return importDefault("../lib/import-with-opts.mjs");
  }
})();

const req =
  // eslint-disable-next-line no-restricted-globals
  process.env.BUILD_FORMAT === "cjs" ? require : createRequire(import.meta.url);

function requireModule(path: string) {
  const mod = req(path);
  return mod && mod.__esModule ? mod : { default: mod };
}

async function tryImport<T>(
  path: string,
  fn: (url: string) => Promise<T>
): Promise<T> {
  const url = pathToFileURL(path).toString();

  try {
    return await fn(url);
  } catch (err) {
    // This might happen when importing `.ts` or `.json` files.
    if (getErrorCode(err) !== "ERR_UNKNOWN_FILE_EXTENSION") {
      throw err;
    }
  }

  return requireModule(path);
}

async function importJson(path: string) {
  const importFn = await importWithOpts;

  if (!importFn) {
    return requireModule(path);
  }

  return tryImport(path, (url) => importFn(url, { assert: { type: "json" } }));
}

export async function importPath(path: string) {
  if (ESM_IMPORT_DISABLED) {
    return requireModule(path);
  }

  if (path.endsWith(".json")) {
    return importJson(path);
  }

  return tryImport(path, (url) => import(url));
}
