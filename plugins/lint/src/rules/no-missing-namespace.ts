import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { isNamespace } from "../utils/manifest";

export default createRule({
  config: object({
    allow: optional(array(string()))
  }),
  factory(ctx) {
    const allowed = new Set(ctx.config?.allow ?? ["default", "kube-system"]);

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (isNamespace(manifest)) return;

          const namespace = manifest.metadata?.namespace;
          if (!namespace) return;

          if (allowed.has(namespace)) return;

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
