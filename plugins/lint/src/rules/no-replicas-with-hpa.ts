import { array, object, optional } from "superstruct";
import { isHPA } from "../utils/manifest";
import { createRule } from "./types";
import {
  buildObjectReferenceMatcher,
  objectReferenceSchema
} from "../utils/object-reference";
import { matchAny } from "../utils/pattern";
import { isRecord } from "@kosko/common-utils";

export default createRule({
  config: object({
    allow: optional(array(objectReferenceSchema))
  }),
  factory(ctx) {
    const isAllowed = matchAny(
      (ctx.config?.allow ?? []).map(buildObjectReferenceMatcher)
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

          const target = manifests.find({ ...ref, namespace });
          if (!target) return;

          if (
            isRecord(target.data) &&
            isRecord(target.data.spec) &&
            typeof target.data.spec.replicas === "number"
          ) {
            ctx.report(
              target,
              `Replicas should be removed because it is managed by HPA.`
            );
          }
        });
      }
    };
  }
});
