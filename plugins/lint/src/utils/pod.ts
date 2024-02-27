import { apiVersionToGroup, isRecord } from "@kosko/common-utils";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import { getObjectValue } from "./object";
import type { PartialDeep } from "type-fest";
import type { IContainer } from "kubernetes-models/v1/Container";
import type { ResourcePath } from "./manifest";
import { getDeploymentLikeSpec } from "./deployment";

const podSpecResources: ResourcePath[] = [
  {
    apiGroup: "",
    kind: "Pod",
    keys: ["spec"]
  }
];

export function getPodSpec(value: unknown): PartialDeep<IPodSpec> | undefined {
  if (!isRecord(value)) return;

  for (const resource of podSpecResources) {
    if (
      typeof value.apiVersion === "string" &&
      apiVersionToGroup(value.apiVersion) === resource.apiGroup &&
      value.kind === resource.kind
    ) {
      const podSpec = getObjectValue(value, resource.keys);

      if (isRecord(podSpec)) {
        return podSpec as unknown as IPodSpec;
      }
    }
  }

  const deployment = getDeploymentLikeSpec(value);

  if (deployment) {
    return deployment.template?.spec;
  }
}

export function collectPodContainers(
  podSpec: PartialDeep<IPodSpec>
): PartialDeep<IContainer>[] {
  return [
    ...(podSpec.containers ?? []),
    ...(podSpec.initContainers ?? []),
    ...(podSpec.ephemeralContainers ?? [])
  ];
}
