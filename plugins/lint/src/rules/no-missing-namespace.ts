import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { isNamespace } from "../utils/manifest";

const builtinNamespaces = new Set(["default", "kube-system"]);

export default createRule({
  config: object({
    allow: optional(array(string()))
  }),
  factory(ctx) {
    const allowed = new Set(ctx.config?.allow);

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (isNamespace(manifest)) return;

          const namespace = manifest.metadata?.namespace;
          if (!namespace) return;

          if (builtinNamespaces.has(namespace) || allowed.has(namespace)) {
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
