import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { isNamespace } from "../utils/manifest";
import { compilePattern, matchAny } from "../utils/pattern";

const builtinNamespaces = new Set(["default", "kube-system"]);

export default createRule({
  config: object({
    allow: optional(array(string()))
  }),
  factory(ctx) {
    const isAllowed = matchAny((ctx.config?.allow ?? []).map(compilePattern));

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (isNamespace(manifest)) return;

          const namespace = manifest.metadata?.namespace;
          if (!namespace) return;

          if (builtinNamespaces.has(namespace) || isAllowed(namespace)) {
            return;
          }

          if (
            manifests.find({
              apiGroup: "",
              kind: "Namespace",
              name: namespace
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            `Namespace "${namespace}" does not exist or is not allowed.`
          );
        });
      }
    };
  }
});
