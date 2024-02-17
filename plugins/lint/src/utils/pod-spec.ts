import { isRecord } from "@kosko/common-utils";
import type { IPodSpec } from "kubernetes-models/v1/PodSpec";
import { getObjectPath } from "./object";

interface PodSpecKind {
  apiVersion: string;
  kind: string;
  path: readonly string[];
}

// The following link lists all resources that contain PodTemplateSpec.
// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#podtemplatespec-v1-core
const podSpecKinds: readonly PodSpecKind[] = [
  {
    apiVersion: "v1",
    kind: "Pod",
    path: ["spec"]
  },
  {
    apiVersion: "v1",
    kind: "ReplicationController",
    path: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "DaemonSet",
    path: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "Deployment",
    path: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "ReplicaSet",
    path: ["spec", "template", "spec"]
  },
  {
    apiVersion: "apps/v1",
    kind: "StatefulSet",
    path: ["spec", "template", "spec"]
  },
  {
    apiVersion: "batch/v1",
    kind: "Job",
    path: ["spec", "template", "spec"]
  },
  {
    apiVersion: "batch/v1",
    kind: "CronJob",
    path: ["spec", "jobTemplate", "spec", "template", "spec"]
  }
];

interface PodSpecResult {
  kind: PodSpecKind;
  spec: IPodSpec;
}

export function getPodSpec(value: unknown): PodSpecResult | undefined {
  if (!isRecord(value)) return;

  for (const kind of podSpecKinds) {
    if (value.apiVersion !== kind.apiVersion || value.kind !== kind.kind) {
      continue;
    }

    const podSpec = getObjectPath<IPodSpec>(value, kind.path);

    if (podSpec == null) return;

    return { kind, spec: podSpec };
  }
}
