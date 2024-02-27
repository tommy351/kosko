import { array, assign, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { isHPA, namespacedNameSchema } from "../utils/manifest";

export default createRule({
  config: object({
    allow: optional(
      array(
        assign(
          namespacedNameSchema,
          object({
            apiVersion: string(),
            kind: string()
          })
        )
      )
    )
  }),
  factory(ctx) {
    const allow = ctx.config?.allow ?? [];

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (!isHPA(manifest)) return;

          const ref = manifest.data.spec?.scaleTargetRef;
          if (!ref || !ref.apiVersion || !ref.kind || !ref.name) return;

          const namespace = manifest.metadata?.namespace;

          if (
            allow.some(
              (a) =>
                a.apiVersion === ref.apiVersion &&
                a.kind === ref.kind &&
                a.name === ref.name &&
                a.namespace === namespace
            )
          ) {
            return;
          }

          if (
            manifests.find({
              apiVersion: ref.apiVersion,
              kind: ref.kind,
              name: ref.name,
              namespace
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            `Scale target "${ref.apiVersion} ${ref.kind} ${ref.name}" does not exist${namespace ? ` in namespace "${namespace}"` : ""}.`
          );
        });
      }
    };
  }
});
