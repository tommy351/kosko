import { array, assign, object, optional, string } from "superstruct";
import { createRule } from "./types";
import {
  compileNamespacedNamePattern,
  isHPA,
  namespacedNameSchema
} from "../utils/manifest";
import { matchAny } from "../utils/pattern";
import { ICrossVersionObjectReference } from "kubernetes-models/autoscaling/v1/CrossVersionObjectReference";

export default createRule({
  config: object({
    allow: optional(
      array(
        assign(
          namespacedNameSchema,
          object({
            apiVersion: optional(string()),
            kind: string()
          })
        )
      )
    )
  }),
  factory(ctx) {
    const isAllowed = matchAny(
      (ctx.config?.allow ?? []).map((value) => {
        const match = compileNamespacedNamePattern(value);

        return (
          ref: Partial<ICrossVersionObjectReference> & { namespace?: string }
        ) => {
          return (
            ref.apiVersion === value.apiVersion &&
            ref.kind === value.kind &&
            match({ name: ref.name || "", namespace: ref.namespace })
          );
        };
      })
    );

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (!isHPA(manifest)) return;

          const ref = manifest.data.spec?.scaleTargetRef;
          if (!ref || !ref.apiVersion || !ref.kind || !ref.name) return;

          const namespace = manifest.metadata?.namespace;

          if (isAllowed({ ...ref, namespace })) {
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
