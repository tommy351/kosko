import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import {
  NamespacedName,
  buildMissingResourceMessage,
  containNamespacedName,
  namespacedNameArraySchema
} from "../utils/manifest";
import { getPodSpec } from "../utils/pod";
import type { PartialDeep } from "type-fest";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const allow = ctx.config?.allow ?? [];

    return {
      validateAll(manifests) {
        function checkName(manifest: Manifest, name: NamespacedName) {
          if (containNamespacedName(allow, name)) return;

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
