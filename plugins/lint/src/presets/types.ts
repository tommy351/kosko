import type { rules } from "../rules/registry";
import type { ExtractRuleConfig } from "../rules/types";
import type { Severity } from "@kosko/generate";

export type Preset = {
  rules: {
    [K in keyof typeof rules]?: {
      severity: Severity;
      config?: ExtractRuleConfig<(typeof rules)[K]>;
    };
  };
};
