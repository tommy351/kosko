import type { ManifestToValidate, Severity } from "@kosko/generate";
import { Struct } from "superstruct";
import { ManifestStore } from "../utils/manifest-store";

export interface Manifest<T = unknown> extends ManifestToValidate {
  data: T;
}

export interface RuleContext<T> {
  config?: T;
  severity: Severity;
  report(manifest: Manifest, message: string): void;
}

export interface ValidateFunc {
  (manifest: Manifest): void;
}

export interface ValidateAllFunc {
  (store: ManifestStore): void;
}

export interface Rule {
  validate?: ValidateFunc;
  validateAll?: ValidateAllFunc;
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
