import type { Plugin } from "rollup";
import {
  isRelative,
  isAbsolute,
  relative,
  dirname,
  sep
} from "@site/src/utils/path";

export default function virtualFS(files: Record<string, string>): Plugin {
  return {
    name: "virtual-fs",
    resolveId(source, importer) {
      if (isAbsolute(source)) {
        if (files[source] != null) {
          return source;
        }

        return;
      }

      if (isRelative(source) && importer) {
        const path = sep + relative(dirname(importer), source);

        if (files[source] != null) {
          return path;
        }
      }
    },
    load(id) {
      if (files[id] != null) {
        return files[id];
      }
    }
  };
}
