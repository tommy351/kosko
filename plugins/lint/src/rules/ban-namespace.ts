import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { compilePattern, matchAny } from "../utils/pattern";

export default createRule({
  config: object({
    namespaces: optional(array(string()))
  }),
  factory(ctx) {
    const match = matchAny((ctx.config?.namespaces ?? []).map(compilePattern));

    return {
      validate(manifest) {
        const namespace = manifest.metadata?.namespace;
        if (!namespace) return;

        if (match(namespace)) {
          ctx.report(manifest, `Namespace "${namespace}" is banned.`);
        }
      }
    };
  }
});
