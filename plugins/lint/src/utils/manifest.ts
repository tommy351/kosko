import { apiVersionToGroup } from "@kosko/common-utils";
import { array, object, optional, string } from "superstruct";
import type { PartialDeep } from "type-fest";
import type { INamespace } from "kubernetes-models/v1/Namespace";
import type { IService } from "kubernetes-models/v1/Service";
import type { IServiceAccount } from "kubernetes-models/v1/ServiceAccount";
import type { IRoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/RoleBinding";
import type { IClusterRoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/ClusterRoleBinding";
import type { IPersistentVolumeClaim } from "kubernetes-models/v1/PersistentVolumeClaim";
import type { IIngress } from "kubernetes-models/networking.k8s.io/v1/Ingress";
import type { IStatefulSet } from "kubernetes-models/apps/v1/StatefulSet";
import type { ICronJob } from "kubernetes-models/batch/v1/CronJob";
import type { IHorizontalPodAutoscaler as IHPAV1 } from "kubernetes-models/autoscaling/v1/HorizontalPodAutoscaler";
import type { IHorizontalPodAutoscaler as IHPAV2Beta1 } from "kubernetes-models/autoscaling/v2beta1/HorizontalPodAutoscaler";
import type { IHorizontalPodAutoscaler as IHPAV2Beta2 } from "kubernetes-models/autoscaling/v2beta2/HorizontalPodAutoscaler";
import type { IHorizontalPodAutoscaler as IHPAV2 } from "kubernetes-models/autoscaling/v2/HorizontalPodAutoscaler";
import type { IHTTPRoute as IHTTPRouteV1Alpha2 } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/HTTPRoute";
import type { IHTTPRoute as IHTTPRouteV1Beta1 } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1beta1/HTTPRoute";
import type { IHTTPRoute as IHTTPRouteV1 } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/HTTPRoute";
import type { IGRPCRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/GRPCRoute";
import type { ITCPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/TCPRoute";
import type { ITLSRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/TLSRoute";
import type { IUDPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/UDPRoute";
import { Manifest } from "../rules/types";
import { Matcher, compilePattern } from "./pattern";

export type GatewayRoute =
  | IHTTPRouteV1Alpha2
  | IHTTPRouteV1Beta1
  | IHTTPRouteV1
  | IGRPCRoute
  | ITCPRoute
  | ITLSRoute
  | IUDPRoute;

const GATEWAY_ROUTE_KINDS = new Set([
  "HTTPRoute",
  "GRPCRoute",
  "TCPRoute",
  "TLSRoute",
  "UDPRoute"
]);

export interface NamespacedName {
  namespace?: string;
  name: string;
}

export const namespacedNameSchema = object({
  namespace: optional(string()),
  name: string()
});

export const namespacedNameArraySchema = array(namespacedNameSchema);

export function compileNamespacedNamePattern(
  arr: NamespacedName
): Matcher<NamespacedName> {
  const nameMatcher = compilePattern(arr.name);
  const baseNamespaceMatcher =
    typeof arr.namespace === "string" && compilePattern(arr.namespace);
  const namespaceMatcher: Matcher<string | undefined> = (value) => {
    if (!baseNamespaceMatcher) return value == null;
    return typeof value === "string" ? baseNamespaceMatcher(value) : false;
  };

  return (value) =>
    nameMatcher(value.name) && namespaceMatcher(value.namespace);
}

export function buildMissingResourceMessage(
  resource: string,
  name: NamespacedName
): string {
  return `${resource} "${name.name}" does not exist${name.namespace ? ` in namespace "${name.namespace}"` : ""}.`;
}

export interface ResourcePath {
  apiGroup: string;
  kind: string;
  keys: readonly string[];
}

type ManifestPredicate<T> = (
  value: Manifest
) => value is Manifest<PartialDeep<T>>;

function versionKindPredicate<T>(
  apiVersion: string,
  kind: string
): ManifestPredicate<T> {
  return (value): value is Manifest<PartialDeep<T>> => {
    return (
      value.metadata?.apiVersion === apiVersion && value.metadata.kind === kind
    );
  };
}

function groupKindPredicate<T>(
  apiGroup: string,
  kind: string
): ManifestPredicate<T> {
  return (value): value is Manifest<PartialDeep<T>> => {
    return (
      value.metadata?.kind === kind &&
      apiVersionToGroup(value.metadata.apiVersion) === apiGroup
    );
  };
}

export const isNamespace = versionKindPredicate<INamespace>("v1", "Namespace");
export const isService = versionKindPredicate<IService>("v1", "Service");
export const isServiceAccount = versionKindPredicate<IServiceAccount>(
  "v1",
  "ServiceAccount"
);
export const isRoleBinding = groupKindPredicate<IRoleBinding>(
  "rbac.authorization.k8s.io",
  "RoleBinding"
);
export const isClusterRoleBinding = groupKindPredicate<IClusterRoleBinding>(
  "rbac.authorization.k8s.io",
  "ClusterRoleBinding"
);
export const isPVC = versionKindPredicate<IPersistentVolumeClaim>(
  "v1",
  "PersistentVolumeClaim"
);
export const isIngress = groupKindPredicate<IIngress>(
  "networking.k8s.io",
  "Ingress"
);
export const isStatefulSet = groupKindPredicate<IStatefulSet>(
  "apps",
  "StatefulSet"
);
export const isCronJob = groupKindPredicate<ICronJob>("batch", "CronJob");
export const isHPA = groupKindPredicate<
  IHPAV1 | IHPAV2Beta1 | IHPAV2Beta2 | IHPAV2
>("autoscaling", "HorizontalPodAutoscaler");

export function isGatewayRoute(
  manifest: Manifest
): manifest is Manifest<PartialDeep<GatewayRoute>> {
  const meta = manifest.metadata;

  return (
    typeof meta?.apiVersion === "string" &&
    apiVersionToGroup(meta.apiVersion) === "gateway.networking.k8s.io" &&
    GATEWAY_ROUTE_KINDS.has(meta.kind)
  );
}
