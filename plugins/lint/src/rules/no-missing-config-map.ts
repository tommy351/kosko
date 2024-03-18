import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import type { PartialDeep } from "type-fest";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import {
  type NamespacedName,
  namespacedNameArraySchema,
  buildMissingResourceMessage,
  compileNamespacedNamePattern
} from "../utils/manifest";
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
              kind: "ConfigMap",
              ...name
            })
          ) {
            return;
          }

          ctx.report(manifest, buildMissingResourceMessage("Config map", name));
        }

        function checkPodSpec(
          manifest: Manifest,
          podSpec: PartialDeep<IPodSpec>
        ) {
          const namespace = manifest.metadata?.namespace;

          for (const container of collectPodContainers(podSpec)) {
            for (const env of container.env ?? []) {
              const ref = env.valueFrom?.configMapKeyRef;

              if (ref?.name && !ref.optional) {
                checkName(manifest, { namespace, name: ref.name });
              }
            }

            for (const envFrom of container.envFrom ?? []) {
              const ref = envFrom.configMapRef;

              if (ref?.name && !ref.optional) {
                checkName(manifest, { namespace, name: ref.name });
              }
            }
          }

          for (const volume of podSpec.volumes ?? []) {
            const { configMap, projected } = volume;

            if (configMap) {
              if (configMap.name && !configMap.optional) {
                checkName(manifest, { namespace, name: configMap.name });
              }
            } else if (projected) {
              for (const src of projected.sources ?? []) {
                if (src.configMap?.name && !src.configMap.optional) {
                  checkName(manifest, { namespace, name: src.configMap.name });
                }
              }
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
