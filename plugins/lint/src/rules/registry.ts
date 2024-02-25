import noMissingNamespace from "./no-missing-namespace";
import noMissingPodVolumeMount from "./no-missing-pod-volume-mount";

export const rules = {
  "no-missing-namespace": noMissingNamespace,
  "no-missing-pod-volume-mount": noMissingPodVolumeMount
} as const;
