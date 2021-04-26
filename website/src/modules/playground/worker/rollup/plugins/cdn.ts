import type { Plugin } from "rollup";
import { isRelative, isAbsolute } from "@site/src/utils/path";
import { getModuleURLForCDN } from "../utils";

function isURL(url: string): boolean {
  return url.includes(":");
}

export default function cdn(): Plugin {
  return {
    name: "cdn",
    resolveId(source) {
      if (isRelative(source) || isAbsolute(source)) {
        return;
      }

      if (isURL(source)) {
        return false;
      }

      return {
        id: getModuleURLForCDN(source),
        external: true
      };
    }
  };
}
