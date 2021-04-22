import type { Plugin } from "rollup";
import { isAbsolute, isRelative } from "../../../utils/path";

export function getModuleURLForCDN(module: string) {
  return `https://cdn.skypack.dev/${module}`;
}

function isURL(url: string): boolean {
  return url.includes(":");
}

export default function createCDNResolvePlugin(): Plugin {
  return {
    name: "cdn-resolve",
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
