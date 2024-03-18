import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import {
  NamespacedName,
  buildMissingResourceMessage,
  compileNamespacedNamePattern,
  namespacedNameArraySchema
} from "../utils/manifest";
import { getPodSpec } from "../utils/pod";
import type { PartialDeep } from "type-fest";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import { matchAny } from "../utils/pattern";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const isAllowed = matchAny(
      (ctx.config?.allow ?? []).map(compileNamespacedNamePattern)
    );

    return {
      validateAll(manifests) {
        function checkName(manifest: Manifest, name: NamespacedName) {
          if (isAllowed(name)) return;

          if (
            manifests.find({
              apiGroup: "",
              kind: "PersistentVolumeClaim",
              ...name
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            buildMissingResourceMessage("Persistent volume claim", name)
          );
        }

        function checkPodSpec(
          manifest: Manifest,
          podSpec: PartialDeep<IPodSpec>
        ) {
          const namespace = manifest.metadata?.namespace;

          for (const volume of podSpec.volumes ?? []) {
            const claimName = volume.persistentVolumeClaim?.claimName;

            if (claimName) {
              checkName(manifest, { namespace, name: claimName });
            }
          }
        }

        manifests.forEach((manifest) => {
          const podSpec = getPodSpec(manifest.data);

          if (podSpec) {
            checkPodSpec(manifest, podSpec);
          }
        });
      }
    };
  }
});
