import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import {
  type HttpRoute,
  NamespacedName,
  buildMissingResourceMessage,
  compileNamespacedNamePattern,
  isHttpRoute,
  isIngress,
  namespacedNameArraySchema,
  isGrpcRoute,
  type GrpcRoute
} from "../utils/manifest";
import type { IIngress } from "kubernetes-models/networking.k8s.io/v1/Ingress";
import type { PartialDeep } from "type-fest";
import type { IIngressBackend } from "kubernetes-models/networking.k8s.io/v1/IngressBackend";
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

          checkName(manifest, {
            namespace: manifest.metadata?.namespace,
            name: backend.service.name
          });
        }

        function checkIngress(manifest: Manifest<PartialDeep<IIngress>>) {
          const { defaultBackend, rules } = manifest.data.spec ?? {};

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

        function checkRoute(
          manifest: Manifest<PartialDeep<HttpRoute | GrpcRoute>>
        ) {
          for (const rule of manifest.data.spec?.rules ?? []) {
            for (const ref of rule.backendRefs ?? []) {
              if (!ref.group && ref.kind === "Service") {
                checkName(manifest, {
                  namespace: ref.namespace ?? manifest.metadata?.namespace,
                  name: ref.name
                });
              }
            }
          }
        }

        manifests.forEach((manifest) => {
          if (isIngress(manifest)) {
            checkIngress(manifest);
          } else if (isHttpRoute(manifest) || isGrpcRoute(manifest)) {
            checkRoute(manifest);
          }
        });
      }
    };
  }
});
