import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import {
  type NamespacedName,
  isClusterRoleBinding,
  isRoleBinding,
  namespacedNameArraySchema,
  buildMissingResourceMessage,
  compileNamespacedNamePattern
} from "../utils/manifest";
import { getPodSpec } from "../utils/pod";
import type { PartialDeep } from "type-fest";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import type { IRoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/RoleBinding";
import { matchAny } from "../utils/pattern";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const isAllowed = matchAny<NamespacedName>([
      (name) => name.name === "default",
      ...(ctx.config?.allow ?? []).map(compileNamespacedNamePattern)
    ]);

    return {
      validateAll(manifests) {
        function checkName(manifest: Manifest, name: NamespacedName) {
          if (isAllowed(name)) {
            return;
          }

          if (
            manifests.find({
              apiGroup: "",
              kind: "ServiceAccount",
              ...name
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            buildMissingResourceMessage("Service account", name)
          );
        }

        function checkPodSpec(
          manifest: Manifest,
          podSpec: PartialDeep<IPodSpec>
        ) {
          const namespace = manifest.metadata?.namespace;

          if (podSpec.serviceAccount) {
            checkName(manifest, {
              namespace,
              name: podSpec.serviceAccount
            });
          }

          if (podSpec.serviceAccountName) {
            checkName(manifest, {
              namespace,
              name: podSpec.serviceAccountName
            });
          }
        }

        function checkRoleBinding(
          manifest: Manifest<PartialDeep<Pick<IRoleBinding, "subjects">>>
        ) {
          const subjects = manifest.data.subjects;
          if (!subjects?.length) return;

          for (const subject of subjects) {
            if (!subject.apiGroup && subject.kind === "ServiceAccount") {
              checkName(manifest, subject);
            }
          }
        }

        manifests.forEach((manifest) => {
          const podSpec = getPodSpec(manifest.data);

          if (podSpec) {
            checkPodSpec(manifest, podSpec);
          } else if (
            isRoleBinding(manifest) ||
            isClusterRoleBinding(manifest)
          ) {
            checkRoleBinding(manifest);
          }
        });
      }
    };
  }
});
