// @ts-check

import resolve from "resolve";
import { promisify } from "node:util";
import { readPackageUp } from "read-pkg-up";

const resolveAsync = promisify(resolve);

/**
 * @param {string} version
 * @returns {boolean}
 */
function isSnapshotVersion(version) {
  return version.startsWith("0.0.0-");
}

/**
 * @param {Record<string, string>} dependencies
 * @returns {import('rollup').Plugin}
 */
export default function replaceDenoImport(dependencies) {
  /**
   * @param {string} source
   * @param {string} importer
   * @returns {Promise<string | undefined>}
   */
  async function getVersion(source, importer) {
    const specifier = dependencies[source];
    if (!specifier) return specifier;

    if (specifier.startsWith("workspace:")) {
      const resolved = await resolveAsync(source, { basedir: importer });
      const pkg = await readPackageUp({ cwd: resolved });
      if (!pkg) return;

      const symbol = specifier[10];
      const {
        packageJson: { version }
      } = pkg;

      if (isSnapshotVersion(version) || symbol === "*") {
        return version;
      }

      return symbol + version;
    }

    return specifier;
  }

  return {
    name: "replace-deno-import",
    async resolveId(source, importer) {
      if (!importer) return null;

      if (source.startsWith("npm:")) {
        return { id: source, external: true };
      }

      if (source.startsWith("node:")) {
        return {
          id: `https://deno.land/std@0.166.0/node/${source.substring(5)}.ts`,
          external: true
        };
      }

      if (source === "yargs") {
        return {
          id: `https://deno.land/x/yargs@v17.6.2-deno/deno.ts`,
          external: true
        };
      }

      const version = await getVersion(source, importer);

      if (!version) return null;

      return { id: `npm:${source}@${version}`, external: true };
    }
  };
}
