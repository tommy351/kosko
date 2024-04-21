import type { IPodTemplateSpec } from "kubernetes-models/v1/PodTemplateSpec";
import type { ResourcePath } from "./manifest";
import type { PartialDeep } from "type-fest";
import { apiVersionToGroup, isRecord } from "@kosko/common-utils";
import type { ILabelSelector } from "@kubernetes-models/apimachinery/apis/meta/v1/LabelSelector";
import { getObjectValue } from "./object";

const deploymentLikeResources: ResourcePath[] = [
  {
    apiGroup: "",
    kind: "ReplicationController",
    keys: ["spec"]
  },
  {
    apiGroup: "apps",
    kind: "Deployment",
    keys: ["spec"]
  },
  {
    apiGroup: "apps",
    kind: "StatefulSet",
    keys: ["spec"]
  },
  {
    apiGroup: "apps",
    kind: "DaemonSet",
    keys: ["spec"]
  },
  {
    apiGroup: "apps",
    kind: "ReplicaSet",
    keys: ["spec"]
  },
  {
    apiGroup: "batch",
    kind: "Job",
    keys: ["spec"]
  },
  {
    apiGroup: "batch",
    kind: "CronJob",
    keys: ["spec", "jobTemplate", "spec"]
  },
  {
    apiGroup: "argoproj.io",
    kind: "Rollout",
    keys: ["spec"]
  },
  {
    apiGroup: "serving.knative.dev",
    kind: "Service",
    keys: ["spec"]
  },
  {
    apiGroup: "serving.knative.dev",
    kind: "Configuration",
    keys: ["spec"]
  }
];

export interface DeploymentLikeSpec {
  template?: PartialDeep<IPodTemplateSpec>;
  selector?: ILabelSelector;
}

export function getDeploymentLikeSpec(
  value: unknown
): DeploymentLikeSpec | undefined {
  if (!isRecord(value)) return;

  for (const resource of deploymentLikeResources) {
    if (
      typeof value.apiVersion === "string" &&
      apiVersionToGroup(value.apiVersion) === resource.apiGroup &&
      value.kind === resource.kind
    ) {
      const spec = getObjectValue(value, resource.keys);

      if (isRecord(spec)) {
        return spec;
      }
    }
  }
}
