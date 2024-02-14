import {
  Ingress as IngressV1,
  type IIngress as IIngressV1
} from "kubernetes-models/networking.k8s.io/v1/Ingress";
import {
  Ingress as IngressV1Beta1,
  type IIngress as IIngressV1Beta1
} from "kubernetes-models/networking.k8s.io/v1beta1/Ingress";
import { Service } from "kubernetes-models/v1/Service";
import { type Rule } from "../registry";
import { type IIngressServiceBackend } from "kubernetes-models/networking.k8s.io/v1/IngressServiceBackend";
import { type IIngressBackend } from "kubernetes-models/networking.k8s.io/v1/IngressBackend";
import {
  ResourceMap,
  type ResourcePosition,
  createResourceMeta
} from "../resource-map";
import { LintError } from "../error";
import { type ITypedLocalObjectReference } from "kubernetes-models/v1/TypedLocalObjectReference";

interface IngressRule {
  http?: HttpIngressRule;
}

interface IngressPath {
  backend: IIngressBackend;
}

interface HttpIngressRule {
  paths: IngressPath[];
}

const rule: Rule = {
  name: "dangling-ingress",
  rule() {
    return (result) => {
      // Key is the namespace and value is a set of service names
      const resourceMap = new ResourceMap();
      const v1Ingresses: IIngressV1[] = [];
      const v1Beta1Ingresses: IIngressV1Beta1[] = [];

      function validateObjectReference(
        pos: ResourcePosition,
        ref: ITypedLocalObjectReference
      ) {
        const resource = resourceMap.getByTypedRef({
          ...ref,
          namespace: pos.namespace
        });

        if (!resource) {
          throw new LintError("Referenced resource not found", {
            position: pos
          });
        }
      }

      function validateServiceBackend(
        pos: ResourcePosition,
        { name, port }: IIngressServiceBackend
      ) {
        if (!port) {
          throw new LintError("Service port is required", { position: pos });
        }

        const svc = resourceMap.get({
          apiVersion: "v1",
          kind: "Service",
          namespace: pos.namespace,
          name: name
        });

        if (!Service.is(svc)) {
          throw new LintError("Service not found", { position: pos });
        }

        const ports = svc.spec?.ports ?? [];
        const nameSet = new Set(ports.map((p) => p.name));
        const numberSet = new Set(ports.map((p) => p.port));

        if (port.name && !nameSet.has(port.name)) {
          throw new LintError(
            `Service port name "${port.name}" is not defined in the service "${name}"`,
            { position: pos }
          );
        }

        if (port.number && !numberSet.has(port.number)) {
          throw new LintError(
            `Service port number "${port.number}" is not defined in the service "${name}"`,
            { position: pos }
          );
        }
      }

      function validateBackend(
        pos: ResourcePosition,
        backend: IIngressBackend
      ) {
        if (backend.resource) {
          validateObjectReference(
            { ...pos, path: [...pos.path, "resource"] },
            backend.resource
          );
        }

        if (backend.service) {
          validateServiceBackend(
            { ...pos, path: [...pos.path, "service"] },
            backend.service
          );
        }
      }

      function validateRule(pos: ResourcePosition, rule: IngressRule) {
        if (!rule.http) return;

        const paths = rule.http.paths;

        for (let i = 0; i < paths.length; i++) {
          validateBackend(
            { ...pos, path: [...pos.path, "http", "paths", `${i}`, "backend"] },
            paths[i].backend
          );
        }
      }

      function validateRules(pos: ResourcePosition, rule: IngressRule[]) {
        for (let i = 0; i < rule.length; i++) {
          validateRule({ ...pos, path: [...pos.path, `${i}`] }, rule[i]);
        }
      }

      function validateV1Ingress(ingress: IIngressV1) {
        if (!ingress.spec) return;

        const meta = createResourceMeta(ingress);
        if (!meta) return;

        if (ingress.spec.defaultBackend) {
          validateBackend(
            { ...meta, path: ["spec", "defaultBackend"] },
            ingress.spec.defaultBackend
          );
        }

        if (ingress.spec.rules) {
          validateRules(
            { ...meta, path: ["spec", "rules"] },
            ingress.spec.rules
          );
        }
      }

      function validateV1Beta1Ingress(ingress: IIngressV1Beta1) {
        if (!ingress.spec) return;

        const meta = createResourceMeta(ingress);
        if (!meta) return;

        if (ingress.spec.backend) {
          validateBackend(
            { ...meta, path: ["spec", "backend"] },
            ingress.spec.backend
          );
        }

        if (ingress.spec.rules) {
          validateRules(
            { ...meta, path: ["spec", "rules"] },
            ingress.spec.rules
          );
        }
      }

      // Collect ingresses and build resource map
      for (const manifest of result.manifests) {
        if (IngressV1.is(manifest.data)) {
          v1Ingresses.push(manifest.data);
        } else if (IngressV1Beta1.is(manifest.data)) {
          v1Beta1Ingresses.push(manifest.data);
        } else {
          resourceMap.add(manifest.data);
        }
      }

      for (const ingress of v1Ingresses) {
        validateV1Ingress(ingress);
      }

      for (const ingress of v1Beta1Ingresses) {
        validateV1Beta1Ingress(ingress);
      }
    };
  }
};

export default rule;
