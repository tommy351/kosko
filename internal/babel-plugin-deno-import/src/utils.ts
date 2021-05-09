import { builtinModules } from "module";
import pkgUp from "pkg-up";
import { dirname } from "path";
import assert from "assert";
import fs from "fs-extra";
import resolve from "resolve";

const CACHED_PACKAGE_JSON_PATH: Record<string, string> = {};
const CACHED_PACKAGE_JSON: Record<string, any> = {};

export function isRelativePath(path: string): boolean {
  return path.startsWith("./") || path.startsWith("../");
}

export function isBuiltinModule(path: string): boolean {
  return builtinModules.includes(path);
}

function getPackageJsonPath(cwd: string): string {
  if (!CACHED_PACKAGE_JSON_PATH[cwd]) {
    const path = pkgUp.sync({ cwd });
    assert(path);

    CACHED_PACKAGE_JSON_PATH[cwd] = path;
  }

  return CACHED_PACKAGE_JSON_PATH[cwd];
}

function readPackageJson(path: string): any {
  if (!CACHED_PACKAGE_JSON[path]) {
    CACHED_PACKAGE_JSON[path] = fs.readJsonSync(path);
  }

  return CACHED_PACKAGE_JSON[path];
}

export function getDependencyVersion(source: string, mod: string): string {
  const pkg = readPackageJson(getPackageJsonPath(dirname(source)));
  const version = pkg.dependencies?.[mod] ?? pkg.devDependencies?.[mod];
  assert(typeof version === "string");

  if (version.startsWith("workspace:")) {
    const resolvedPath = resolve.sync(mod, { basedir: dirname(source) });
    const workspace = readPackageJson(
      getPackageJsonPath(dirname(resolvedPath))
    );
    assert(typeof workspace.version === "string");

    return workspace.version;
  }

  return version;
}
