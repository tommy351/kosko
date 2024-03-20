import { boolean, object, optional } from "superstruct";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import { type Manifest, createRule } from "./types";
import type { ISecurityContext } from "kubernetes-models/v1/SecurityContext";
import type { IContainer } from "kubernetes-models/v1/Container";
import type { PartialDeep } from "type-fest";

export default createRule({
  config: object({
    allowPrivilegeEscalation: optional(boolean()),
    privileged: optional(boolean()),
    runAsNonRoot: optional(boolean()),
    readOnlyRootFilesystem: optional(boolean())
  }),
  factory(ctx) {
    const config = ctx.config ?? {};

    function validateBool(
      manifest: Manifest,
      container: PartialDeep<IContainer>,
      key: keyof ISecurityContext & keyof typeof config
    ) {
      const expected = config[key];
      if (typeof expected !== "boolean") return;

      if (expected !== container.securityContext?.[key]) {
        ctx.report(
          manifest,
          `Container "${container.name}" must set securityContext.${key} to ${expected}.`
        );
      }
    }

    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        for (const container of collectPodContainers(podSpec)) {
          const containerCtx = container.securityContext;

          if (containerCtx) {
            validateBool(manifest, container, "allowPrivilegeEscalation");
            validateBool(manifest, container, "privileged");
            validateBool(manifest, container, "runAsNonRoot");
            validateBool(manifest, container, "readOnlyRootFilesystem");
          } else {
            ctx.report(
              manifest,
              `Container "${container.name}" must define a security context.`
            );
          }
        }
      }
    };
  }
});
