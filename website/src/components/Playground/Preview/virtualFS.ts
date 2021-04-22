import type { Plugin } from "rollup";
import { isAbsolute, isRelative, relative, dirname } from "../../../utils/path";

export default function createVirtualFSPlugin(
  files: Record<string, string>
): Plugin {
  return {
    name: "virtual-fs",
    resolveId(source, importer) {
      if (isAbsolute(source)) {
        return source;
      }

      if (isRelative(source)) {
        const path = "/" + relative(dirname(importer), source);
        return path;
      }
    },
    load(id) {
      if (files[id] != null) {
        return files[id];
      }
    }
  };
}
