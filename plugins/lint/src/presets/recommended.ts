import { Preset } from "./types";

const preset = {
  rules: {
    "no-missing-config-map": { severity: "error" },
    "no-missing-gateway-class": { severity: "error" },
    "no-missing-gateway": { severity: "error" },
    "no-missing-namespace": { severity: "error" },
    "no-missing-pod-volume-mount": { severity: "error" },
    "no-missing-pv": { severity: "error" },
    "no-missing-pvc": { severity: "error" },
    "no-missing-role": { severity: "error" },
    "no-missing-scale-target": { severity: "error" },
    "no-missing-secret": { severity: "error" },
    "no-missing-service-account": { severity: "error" },
    "no-missing-service": { severity: "error" },
    "no-replicas-with-hpa": { severity: "warning" },
    "require-container-image": { severity: "error" },
    "require-env-name": { severity: "error" },
    "require-service-port-name": { severity: "error" },
    "unique-container-name": { severity: "error" },
    "unique-container-port-name": { severity: "warning" },
    "unique-env-name": { severity: "warning" },
    "unique-service-port-name": { severity: "error" },
    "valid-cron-job-schedule": { severity: "error" },
    "valid-hpa-replicas": { severity: "error" },
    "valid-pod-selector": { severity: "error" },
    "valid-probe-port": { severity: "error" }
  }
} satisfies Preset;

export default preset;
