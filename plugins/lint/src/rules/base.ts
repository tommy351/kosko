import type { Manifest, Result } from "@kosko/generate";
import { Struct } from "superstruct";

export enum Severity {
  Off = "off",
  Warn = "warn",
  Error = "error"
}

export interface ValidateResult {
  path: readonly string[];
  message: string;
}

export interface ValidateAllResult extends ValidateResult {
  manifest: Manifest;
}

export interface FullValidateResult extends ValidateAllResult {
  rule: string;
  severity: Exclude<Severity, Severity.Off>;
}

export interface RuleContext<T> {
  config: T;
}

export interface BaseRule<T> {
  validate?(ctx: RuleContext<T>, manifest: Manifest): ValidateResult[];
  validateAll?(ctx: RuleContext<T>, result: Result): ValidateAllResult[];
}

export interface RuleWithConfig<T> extends BaseRule<T> {
  config: Struct<T>;
}

export interface RuleWithoutConfig extends BaseRule<void> {
  config?: undefined;
}

export type Rule<T> = RuleWithConfig<T> | RuleWithoutConfig;

export function createRule<T>(rule: RuleWithConfig<T>): RuleWithConfig<T>;
export function createRule(rule: RuleWithoutConfig): RuleWithoutConfig;
export function createRule<T>(rule: Rule<T>) {
  return rule;
}
