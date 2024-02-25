import type { Severity } from "@kosko/generate";
import type { rules } from "../rules/registry";
import type { ExtractRuleConfig } from "../rules/types";

type PresetRules = {
  [K in keyof typeof rules]?: {
    severity: Severity;
    config?: ExtractRuleConfig<(typeof rules)[K]>;
  };
};

export interface Preset {
  rules: PresetRules;
}
