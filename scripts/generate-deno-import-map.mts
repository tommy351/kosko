import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT_DIR = join(fileURLToPath(import.meta.url), "../..");
const PACKAGES_DIR = join(ROOT_DIR, "packages");
const IMPORT_MAP_PATH = join(ROOT_DIR, "integration/deno-import-map.json");
const INIT_IMPORT_MAP_PATH = join(
  ROOT_DIR,
  "packages/cli/templates/deno/import_map.json"
);

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const imports: Record<string, string> = {
  ...JSON.parse(await readFile(INIT_IMPORT_MAP_PATH, "utf8")).imports,

  // Override the value of `@kosko/env` to fix the`ERR_INVALID_FILE_URL_HOST`
  // error when importing `@kosko/env`.
  "@kosko/env": pathToFileURL(
    join(PACKAGES_DIR, "env/dist/index.deno.mjs")
  ).toString(),

  // For `kosko` package.
  "@kosko/cli": pathToFileURL(
    join(PACKAGES_DIR, "cli/dist/index.deno.mjs")
  ).toString()
};

for (const name of await readdir(PACKAGES_DIR)) {
  const pkgDirPath = join(PACKAGES_DIR, name);
  const pkgJsonPath = join(pkgDirPath, "package.json");
  if (!(await fileExists(pkgJsonPath))) continue;

  const pkg = JSON.parse(await readFile(pkgJsonPath, "utf8"));
  const denoEntry =
    pkg.exports?.["."]?.deno ??
    pkg.exports?.deno ??
    pkg.exports?.import ??
    pkg.exports?.default;
  if (!denoEntry) continue;

  const denoEntryPath = resolve(pkgDirPath, denoEntry);

  imports[`npm:${pkg.name}@^${pkg.version}`] =
    pathToFileURL(denoEntryPath).toString();
}

await writeFile(IMPORT_MAP_PATH, JSON.stringify({ imports }, null, "  "));
