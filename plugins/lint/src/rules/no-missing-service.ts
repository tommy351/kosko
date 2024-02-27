import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import {
  NamespacedName,
  buildMissingResourceMessage,
  containNamespacedName,
  isIngress,
  isStatefulSet,
  namespacedNameArraySchema
} from "../utils/manifest";
import type { IIngress } from "kubernetes-models/networking.k8s.io/v1/Ingress";
import { PartialDeep } from "type-fest";
import { IIngressBackend } from "kubernetes-models/networking.k8s.io/v1/IngressBackend";
import { IStatefulSet } from "kubernetes-models/apps/v1/StatefulSet";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const allow = ctx.config?.allow ?? [];

    return {
      validateAll(manifests) {
        function checkName(manifest: Manifest, serviceName: string) {
          const name: NamespacedName = {
            namespace: manifest.metadata?.namespace,
            name: serviceName
          };

          if (containNamespacedName(allow, name)) return;

          if (
            manifests.find({
              apiGroup: "",
              kind: "Service",
              ...name
            })
          ) {
            return;
          }

          ctx.report(manifest, buildMissingResourceMessage("Service", name));
        }

        function checkIngressBackend(
          manifest: Manifest,
          backend: PartialDeep<IIngressBackend>
        ) {
          if (!backend.service?.name) return;

          checkName(manifest, backend.service.name);
        }

        function checkIngress(
          manifest: Manifest,
          ingress: PartialDeep<IIngress>
        ) {
          const { defaultBackend, rules } = ingress.spec ?? {};

          if (defaultBackend) {
            checkIngressBackend(manifest, defaultBackend);
          }

          for (const rule of rules ?? []) {
            for (const path of rule.http?.paths ?? []) {
              if (path.backend) {
                checkIngressBackend(manifest, path.backend);
              }
            }
          }
        }

        function checkStatefulSet(
          manifest: Manifest,
          statefulSet: PartialDeep<IStatefulSet>
        ) {
          const serviceName = statefulSet.spec?.serviceName;

          if (serviceName) {
            checkName(manifest, serviceName);
          }
        }

        manifests.forEach((manifest) => {
          if (isIngress(manifest)) {
            checkIngress(manifest, manifest.data);
          } else if (isStatefulSet(manifest)) {
            checkStatefulSet(manifest, manifest.data);
          }
        });
      }
    };
  }
});
