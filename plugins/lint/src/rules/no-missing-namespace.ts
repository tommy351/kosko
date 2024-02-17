import { array, defaulted, object, optional, string } from "superstruct";
import { type ValidateAllResult, createRule } from "./base";
import { isNamespace } from "../utils/namespace";
import { isRecord } from "@kosko/common-utils";

export default createRule({
  config: optional(
    object({
      allow: defaulted(array(string()), ["default", "kube-system"])
    })
  ),
  validateAll(ctx, result) {
    const results: ValidateAllResult[] = [];
    const namespaces = new Set<string>();

    for (const manifest of result.manifests) {
      if (isNamespace(manifest.data) && manifest.data.metadata?.name) {
        namespaces.add(manifest.data.metadata.name);
      }
    }

    for (const manifest of result.manifests) {
      if (
        isNamespace(manifest.data) ||
        !isRecord(manifest.data) ||
        !isRecord(manifest.data.metadata)
      ) {
        continue;
      }

      const namespace = manifest.data.metadata.namespace;

      if (
        typeof namespace === "string" &&
        !namespaces.has(namespace) &&
        !ctx.config?.allow.includes(namespace)
      ) {
        results.push({
          manifest,
          path: ["metadata", "namespace"],
          message: `Namespace "${namespace}" does not exist or is not allowed.`
        });
      }
    }

    return results;
  }
});
