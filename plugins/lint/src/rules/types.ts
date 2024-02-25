import type { ManifestToValidate, Severity } from "@kosko/generate";
import { Struct } from "superstruct";

export interface RuleContext<T> {
  config: T;
  severity: Severity;
  report(manifest: ManifestToValidate, message: string): void;
}

export interface Rule {
  validate?(manifest: ManifestToValidate): void;
  validateAll?(manifests: readonly ManifestToValidate[]): void;
}

export interface RuleFactory<T> {
  config?: Struct<T>;
  factory(ctx: RuleContext<T>): Rule;
}

export type ExtractRuleConfig<T> = T extends RuleFactory<infer C> ? C : never;

export function createRule<T = undefined>(
  rule: RuleFactory<T>
): RuleFactory<T> {
  return rule;
}
