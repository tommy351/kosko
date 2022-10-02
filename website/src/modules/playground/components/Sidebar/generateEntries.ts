import { groupBy } from "lodash";
import { sep } from "@site/src/utils/path";
import { Entry, EntryType, File, Directory } from "./types";
import { DIRECTORY_PLACEHOLDER } from "../../constants";

function doGenerateEntries(paths: readonly string[], prefix: string): Entry[] {
  const { "": files = [], ...dirs } = groupBy(paths, (path) => {
    const index = path.indexOf(sep);
    return index === -1 ? "" : path.substring(0, index);
  });

  return [
    ...Object.entries(dirs).map(([name, children]): Directory => {
      return {
        type: EntryType.Directory,
        name,
        path: prefix + name,
        children: doGenerateEntries(
          children.map((v) => v.substring(name.length + 1)),
          prefix + name + sep
        )
      };
    }),
    ...files
      .filter((name) => name !== DIRECTORY_PLACEHOLDER)
      .map(
        (name): File => ({
          type: EntryType.File,
          name,
          path: prefix + name
        })
      )
  ].sort((a, b) => {
    // Move directories to the front
    if (a.type !== b.type) {
      if (a.type === EntryType.Directory) return -1;
      if (b.type === EntryType.Directory) return 1;
    }

    // Sort by name
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
}

export default function generateEntries(paths: readonly string[]): Entry[] {
  return doGenerateEntries(
    paths.map((path) => path.substring(1)),
    sep
  );
}
