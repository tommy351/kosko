import { array, assign, enums, object, optional } from "superstruct";
import { createRule } from "./types";
import {
  type NamespacedName,
  buildMissingResourceMessage,
  isClusterRoleBinding,
  isRoleBinding,
  namespacedNameSchema,
  compileNamespacedNamePattern
} from "../utils/manifest";
import { compilePattern, matchAny } from "../utils/pattern";

// https://github.com/kubernetes/kubernetes/blob/656cb1028ea5af837e69b5c9c614b008d747ab63/plugin/pkg/auth/authorizer/rbac/bootstrappolicy/policy.go#L194
const builtinClusterRoles = new Set(["admin", "cluster-admin", "edit", "view"]);

// https://github.com/kubernetes/kubernetes/blob/656cb1028ea5af837e69b5c9c614b008d747ab63/plugin/pkg/auth/authorizer/rbac/bootstrappolicy/namespace_policy.go#L74
const builtinRoles = new Set(["extension-apiserver-authentication-reader"]);

function isSystemRole(name: string): boolean {
  return name.startsWith("system:");
}

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

    const isRoleAllowed = matchAny<NamespacedName>([
      (name) => isSystemRole(name.name),
      (name) => name.namespace === "kube-system" && builtinRoles.has(name.name),
      ...allow
        .filter((a) => a.kind === "Role")
        .map(compileNamespacedNamePattern)
    ]);

    const isClusterRoleAllowed = matchAny<string>([
      isSystemRole,
      (name) => builtinClusterRoles.has(name),
      ...allow
        .filter((a) => a.kind === "ClusterRole")
        .map((v) => compilePattern(v.name))
    ]);

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
            if (isClusterRoleAllowed(roleRef.name)) return;
          } else {
            if (isRoleAllowed(name)) return;
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
