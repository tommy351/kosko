import { BundleOptions, BundleResult } from "../types";
import * as rollup from "rollup/dist/rollup.browser";
import entry from "./plugins/entry";
import virtualFS from "./plugins/virtualFS";
import cdn from "./plugins/cdn";
import { RollupWarning } from "rollup";

export async function bundle(options: BundleOptions): Promise<BundleResult> {
  const warnings: RollupWarning[] = [];
  const build = await rollup.rollup({
    plugins: [entry(options), virtualFS(options.files), cdn()],
    onwarn(warning) {
      warnings.push(warning);
    }
  });

  const result = await build.generate({});

  return {
    code: result.output[0].code,
    warnings
  };
}
