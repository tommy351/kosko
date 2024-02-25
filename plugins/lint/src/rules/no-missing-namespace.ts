import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import type { INamespace } from "kubernetes-models/v1/Namespace";
import { isRecord } from "@kosko/common-utils";

function isNamespace(value: unknown): value is INamespace {
  return (
    isRecord(value) && value.apiVersion === "v1" && value.kind === "Namespace"
  );
}

function getNamespaceName(value: unknown): string | undefined {
  if (!isNamespace(value)) return;

  const name = value.metadata?.name;
  if (typeof name === "string") return name;
}

function getManifestNamespace(value: unknown): string | undefined {
  if (!isRecord(value)) return;
  if (!isRecord(value.metadata)) return;

  const namespace = value.metadata.namespace;
  if (typeof namespace === "string") return namespace;
}

export default createRule({
  config: optional(
    object({
      allow: optional(array(string()))
    })
  ),
  factory(ctx) {
    const allowed = new Set(ctx.config?.allow ?? ["default", "kube-system"]);

    return {
      validateAll(manifests) {
        const namespaces = new Set<string>();

        for (const manifest of manifests) {
          const name = getNamespaceName(manifest.data);
          if (name) namespaces.add(name);
        }

        for (const manifest of manifests) {
          if (isNamespace(manifest.data)) continue;

          const namespace = getManifestNamespace(manifest.data);
          if (!namespace) return;

          if (!namespaces.has(namespace) && !allowed.has(namespace)) {
            ctx.report(
              manifest,
              `Namespace "${namespace}" does not exist or is not allowed.`
            );
          }
        }
      }
    };
  }
});
