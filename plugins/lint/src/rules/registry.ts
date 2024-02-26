import noEmptyNamespace from "./no-empty-namespace";
import noMissingNamespace from "./no-missing-namespace";
import noMissingPodVolumeMount from "./no-missing-pod-volume-mount";

export const rules = {
  "no-empty-namespace": noEmptyNamespace,
  "no-missing-namespace": noMissingNamespace,
  "no-missing-pod-volume-mount": noMissingPodVolumeMount
} as const;
