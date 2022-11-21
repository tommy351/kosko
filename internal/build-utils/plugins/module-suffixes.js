// @ts-check

import { stat } from "node:fs/promises";
import { dirname, isAbsolute, join } from "node:path";

/**
 * @param {readonly string[]} suffixes
 * @returns {import('rollup').Plugin}
 */
export default function moduleSuffixes(suffixes) {
  return {
    name: "module-suffixes",
    async resolveId(source, importer) {
      if (!importer || isAbsolute(source)) return null;

      for (const suffix of suffixes) {
        const path = join(dirname(importer), `${source}${suffix}.ts`);

        try {
          const stats = await stat(path);
          if (stats.isFile()) return path;
        } catch (err) {
          if (err.code !== "ENOENT") throw err;
        }
      }

      return null;
    }
  };
}
