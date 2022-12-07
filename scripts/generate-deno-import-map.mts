import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(fileURLToPath(import.meta.url), "../..");
const PACKAGES_DIR = join(ROOT_DIR, "packages");
const IMPORT_MAP_PATH = join(ROOT_DIR, "integration/deno-import-map.json");

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const imports: Record<string, string> = {
  "npm:@kosko/cli/deno.js": "../packages/cli/deno.js",
  "npm:@kosko/env": "../packages/env/dist/index.deno.mjs"
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

  imports[`npm:${pkg.name}@^${pkg.version}`] = posix.relative(
    dirname(IMPORT_MAP_PATH),
    denoEntryPath
  );
}

await writeFile(IMPORT_MAP_PATH, JSON.stringify({ imports }, null, "  "));
