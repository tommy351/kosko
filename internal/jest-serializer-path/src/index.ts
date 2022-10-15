import { projectRoot } from "@kosko/test-utils";
import { homedir } from "node:os";
import { join } from "node:path";
import escapeStringRegExp from "escape-string-regexp";

function getProjectRootPathsToReplace() {
  const paths = [projectRoot];
  const normalized = projectRoot.replace(/\\/g, "/");
  const home = homedir();

  if (projectRoot.startsWith(home)) {
    paths.push(join("~", projectRoot.substring(home.length)));
  }

  if (projectRoot !== normalized) {
    paths.push(normalized);
  }

  return paths;
}

function getProjectRootRegExp() {
  const pathsRegExp = getProjectRootPathsToReplace()
    .map(escapeStringRegExp)
    .join("|");

  return new RegExp(`(?:file:/+)?(${pathsRegExp})`, "g");
}

export function test(value: unknown) {
  return typeof value === "string" && getProjectRootRegExp().test(value);
}

export function print(value: string, serialize: (value: string) => string) {
  return serialize(value.replace(getProjectRootRegExp(), "<PROJECT_ROOT>"));
}
