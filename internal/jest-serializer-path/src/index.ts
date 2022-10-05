import { projectRoot } from "@kosko/test-utils";
import { homedir } from "os";
import { join, posix } from "path";

function getProjectRootPathsToReplace() {
  const paths = [projectRoot];
  const normalized = posix.normalize(projectRoot);
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
  return new RegExp(getProjectRootPathsToReplace().join("|"), "g");
}

export function test(value: unknown) {
  return typeof value === "string" && getProjectRootRegExp().test(value);
}

export function print(value: string, serialize: (value: string) => string) {
  return serialize(value.replace(getProjectRootRegExp(), "<PROJECT_ROOT>"));
}
