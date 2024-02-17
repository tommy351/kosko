import { Severity } from "../rules/base";
import { Preset } from "./base";

const preset: Preset = {
  rules: {
    "no-missing-namespace": { severity: Severity.Error },
    "no-missing-volume-mounts": { severity: Severity.Error }
  }
};

export default preset;
