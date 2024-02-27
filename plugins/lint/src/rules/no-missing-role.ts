import { array, assign, enums, object, optional } from "superstruct";
import { createRule } from "./types";
import {
  type NamespacedName,
  buildMissingResourceMessage,
  containNamespacedName,
  isClusterRoleBinding,
  isRoleBinding,
  namespacedNameSchema
} from "../utils/manifest";

export default createRule({
  config: object({
    allow: optional(
      array(
        assign(
          namespacedNameSchema,
          object({
            kind: enums(["Role", "ClusterRole"])
          })
        )
      )
    )
  }),
  factory(ctx) {
    const allow = ctx.config?.allow ?? [];
    const allowRoles = allow.filter((a) => a.kind === "Role");
    const allowClusterRoles = new Set(
      allow.filter((a) => a.kind === "ClusterRole").map((v) => v.name)
    );

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (!isRoleBinding(manifest) && !isClusterRoleBinding(manifest)) {
            return;
          }

          const { roleRef } = manifest.data;
          if (!roleRef?.apiGroup || !roleRef.kind || !roleRef.name) return;

          const isClusterRole = roleRef.kind === "ClusterRole";
          const name: NamespacedName = {
            namespace: manifest.metadata?.namespace,
            name: roleRef.name
          };

          if (isClusterRole) {
            if (allowClusterRoles.has(roleRef.name)) return;
          } else {
            if (containNamespacedName(allowRoles, name)) return;
          }

          if (
            manifests.find({
              ...roleRef,
              ...(!isClusterRole && { namespace: name.namespace })
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            buildMissingResourceMessage(
              isClusterRole ? "Cluster role" : "Role",
              name
            )
          );
        });
      }
    };
  }
});
