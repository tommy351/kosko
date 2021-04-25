import { BundleOptions, BundleResult } from "../types";
import * as rollup from "rollup/dist/rollup.browser";
import type { SourceMap } from "rollup";
import entry from "./plugins/entry";
import virtualFS from "./plugins/virtualFS";
import cdn from "./plugins/cdn";

function generateInlineSourceMap(map: SourceMap): string {
  return `//# sourceMappingURL=data:application/json;base64,${btoa(
    JSON.stringify(map)
  )}`;
}

export async function bundle(options: BundleOptions): Promise<BundleResult> {
  const warnings: string[] = [];
  const build = await rollup.rollup({
    plugins: [entry(options), virtualFS(options.files), cdn()],
    onwarn(warning) {
      warnings.push(warning.toString());
    }
  });

  const result = await build.generate({
    sourcemap: true
  });

  const output = result.output[0];

  return {
    code: output.map
      ? output.code + "\n" + generateInlineSourceMap(output.map)
      : output.code,
    warnings
  };
}
