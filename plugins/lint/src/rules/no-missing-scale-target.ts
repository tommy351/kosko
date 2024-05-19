import { array, object, optional } from "superstruct";
import { Manifest, createRule } from "./types";
import { isHPA, isMPA, isScaledObject, isVPA } from "../utils/manifest";
import { matchAny } from "../utils/pattern";
import {
  buildObjectReferenceMatcher,
  objectReferenceSchema
} from "../utils/object-reference";

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
        function checkRef(
          manifest: Manifest,
          ref?: { apiVersion?: string; kind?: string; name?: string }
        ) {
          if (!ref || !ref.apiVersion || !ref.kind || !ref.name) return;

          const namespace = manifest.metadata?.namespace;

          if (isAllowed({ ...ref, namespace })) {
            return;
          }

          if (manifests.find({ ...ref, namespace })) {
            return;
          }

          ctx.report(
            manifest,
            `Scale target "${ref.apiVersion} ${ref.kind} ${ref.name}" does not exist${namespace ? ` in namespace "${namespace}"` : ""}.`
          );
        }

        manifests.forEach((manifest) => {
          if (isHPA(manifest) || isMPA(manifest) || isScaledObject(manifest)) {
            checkRef(manifest, manifest.data.spec?.scaleTargetRef);
          } else if (isVPA(manifest)) {
            checkRef(manifest, manifest.data.spec?.targetRef);
          }
        });
      }
    };
  }
});
