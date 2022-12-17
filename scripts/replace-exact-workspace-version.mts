import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(fileURLToPath(import.meta.url), "../..");
const PACKAGES_DIR = join(ROOT_DIR, "packages");

interface Package {
  path: string;
  packageJson: {
    version?: string;
    dependencies?: Record<string, string>;
  };
}

const pkgMap = new Map<string, Package>();

for (const name of await readdir(PACKAGES_DIR)) {
  const path = join(PACKAGES_DIR, name, "package.json");
  const pkg = JSON.parse(await readFile(path, "utf8"));

  pkgMap.set(pkg.name, {
    path,
    packageJson: pkg
  });
}

for (const pkg of pkgMap.values()) {
  const { dependencies } = pkg.packageJson;

  if (!dependencies) continue;

  for (const [name, version] of Object.entries(dependencies)) {
    if (version.startsWith("workspace:")) {
      const dep = pkgMap.get(name);

      if (dep?.packageJson.version) {
        dependencies[name] = dep.packageJson.version;
      }
    }
  }

  console.log("Writing", pkg.path);
  await writeFile(pkg.path, JSON.stringify(pkg.packageJson, null, "  "));
}
