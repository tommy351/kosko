import { Preset } from "./types";

const preset: Preset = {
  rules: {
    "no-missing-config-map": { severity: "error" },
    "no-missing-namespace": { severity: "error" },
    "no-missing-pod-volume-mount": { severity: "error" },
    "no-missing-pv": { severity: "error" },
    "no-missing-pvc": { severity: "error" },
    "no-missing-role": { severity: "error" },
    "no-missing-scale-target": { severity: "error" },
    "no-missing-secret": { severity: "error" },
    "no-missing-service-account": { severity: "error" },
    "no-missing-service": { severity: "error" },
    "require-container-image": { severity: "error" },
    "require-container-port-name": { severity: "error" },
    "require-env-name": { severity: "error" },
    "require-service-port-name": { severity: "error" },
    "unique-container-name": { severity: "error" },
    "unique-env-name": { severity: "error" },
    "unique-service-port-name": { severity: "error" },
    "valid-cron-job-schedule": { severity: "error" },
    "valid-hpa-replicas": { severity: "error" },
    "valid-pod-selector": { severity: "error" },
    "valid-probe-port": { severity: "error" }
  }
};

export default preset;
