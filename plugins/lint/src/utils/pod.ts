import { isRecord } from "@kosko/common-utils";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import { getObjectValue } from "./object";

interface PodSpecResource {
  apiVersion: string;
  kind: string;
  keys: readonly string[];
}

const podSpecResources: PodSpecResource[] = [
  {
    apiVersion: "v1",
    kind: "Pod",
    keys: ["spec"]
  },
  {
    apiVersion: "v1",
    kind: "ReplicationController",
    keys: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "Deployment",
    keys: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "StatefulSet",
    keys: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "DaemonSet",
    keys: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "ReplicaSet",
    keys: ["spec", "template", "spec"]
  },
  {
    apiVersion: "batch/v1",
    kind: "Job",
    keys: ["spec", "template", "spec"]
  },
  {
    apiVersion: "batch/v1",
    kind: "CronJob",
    keys: ["spec", "jobTemplate", "spec", "template", "spec"]
  }
];

export function getPodSpec(value: unknown): IPodSpec | undefined {
  if (!isRecord(value)) return;

  for (const resource of podSpecResources) {
    if (
      value.apiVersion === resource.apiVersion &&
      value.kind === resource.kind
    ) {
      const podSpec = getObjectValue(value, resource.keys);

      if (isRecord(podSpec)) {
        return podSpec as unknown as IPodSpec;
      }
    }
  }
}
