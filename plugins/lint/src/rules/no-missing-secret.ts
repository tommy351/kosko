import { object, optional } from "superstruct";
import { type Manifest, createRule } from "./types";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import type { PartialDeep } from "type-fest";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import {
  type NamespacedName,
  namespacedNameArraySchema,
  buildMissingResourceMessage,
  isIngress,
  isServiceAccount,
  compileNamespacedNamePattern
} from "../utils/manifest";
import type { IIngress } from "kubernetes-models/networking.k8s.io/v1/Ingress";
import { IServiceAccount } from "kubernetes-models/v1/ServiceAccount";
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
              kind: "Secret",
              ...name
            })
          ) {
            return;
          }

          ctx.report(manifest, buildMissingResourceMessage("Secret", name));
        }

        function checkPodSpec(
          manifest: Manifest,
          podSpec: PartialDeep<IPodSpec>
        ) {
          const namespace = manifest.metadata?.namespace;

          for (const container of collectPodContainers(podSpec)) {
            for (const env of container.env ?? []) {
              const ref = env.valueFrom?.secretKeyRef;

              if (ref?.name && !ref.optional) {
                checkName(manifest, { namespace, name: ref.name });
              }
            }

            for (const envFrom of container.envFrom ?? []) {
              const ref = envFrom.secretRef;

              if (ref?.name && !ref.optional) {
                checkName(manifest, { namespace, name: ref.name });
              }
            }
          }

          for (const volume of podSpec.volumes ?? []) {
            const {
              secret,
              azureFile,
              cephfs,
              cinder,
              flexVolume,
              iscsi,
              projected,
              rbd,
              scaleIO,
              storageos
            } = volume;

            if (secret) {
              if (secret.secretName && !secret.optional) {
                checkName(manifest, { namespace, name: secret.secretName });
              }
            } else if (azureFile) {
              if (azureFile.secretName) {
                checkName(manifest, { namespace, name: azureFile.secretName });
              }
            } else if (cephfs) {
              if (cephfs.secretRef?.name) {
                checkName(manifest, { namespace, name: cephfs.secretRef.name });
              }
            } else if (cinder) {
              if (cinder.secretRef?.name) {
                checkName(manifest, { namespace, name: cinder.secretRef.name });
              }
            } else if (flexVolume) {
              if (flexVolume.secretRef?.name) {
                checkName(manifest, {
                  namespace,
                  name: flexVolume.secretRef.name
                });
              }
            } else if (iscsi) {
              if (iscsi.secretRef?.name) {
                checkName(manifest, { namespace, name: iscsi.secretRef.name });
              }
            } else if (projected) {
              for (const src of projected.sources ?? []) {
                if (src.secret?.name && !src.secret.optional) {
                  checkName(manifest, { namespace, name: src.secret.name });
                }
              }
            } else if (rbd) {
              if (rbd.secretRef?.name) {
                checkName(manifest, { namespace, name: rbd.secretRef.name });
              }
            } else if (scaleIO) {
              if (scaleIO.secretRef?.name) {
                checkName(manifest, {
                  namespace,
                  name: scaleIO.secretRef.name
                });
              }
            } else if (storageos) {
              if (storageos.secretRef?.name) {
                checkName(manifest, {
                  namespace,
                  name: storageos.secretRef.name
                });
              }
            }
          }

          for (const secret of podSpec.imagePullSecrets ?? []) {
            if (secret.name) {
              checkName(manifest, { namespace, name: secret.name });
            }
          }
        }

        function checkIngress(
          manifest: Manifest,
          ingress: PartialDeep<IIngress>
        ) {
          const tlsArr = ingress.spec?.tls;
          if (!tlsArr?.length) return;

          const namespace = manifest.metadata?.namespace;

          for (const tls of tlsArr) {
            if (tls.secretName) {
              checkName(manifest, { namespace, name: tls.secretName });
            }
          }
        }

        function checkServiceAccount(
          manifest: Manifest,
          serviceAccount: PartialDeep<IServiceAccount>
        ) {
          const { imagePullSecrets, secrets } = serviceAccount;

          const namespace = manifest.metadata?.namespace;

          for (const secret of imagePullSecrets ?? []) {
            if (secret.name) {
              checkName(manifest, { namespace, name: secret.name });
            }
          }

          for (const secret of secrets ?? []) {
            if (secret.name) {
              checkName(manifest, { namespace, name: secret.name });
            }
          }
        }

        manifests.forEach((manifest) => {
          const podSpec = getPodSpec(manifest.data);

          if (podSpec) {
            checkPodSpec(manifest, podSpec);
          } else if (isIngress(manifest)) {
            checkIngress(manifest, manifest.data);
          } else if (isServiceAccount(manifest)) {
            checkServiceAccount(manifest, manifest.data);
          }
        });
      }
    };
  }
});
