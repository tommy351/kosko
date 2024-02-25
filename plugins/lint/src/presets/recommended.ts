import { Preset } from "./types";

const preset: Preset = {
  rules: {
    "no-missing-namespace": { severity: "error" },
    "no-missing-pod-volume-mount": { severity: "error" }
  }
};

export default preset;
