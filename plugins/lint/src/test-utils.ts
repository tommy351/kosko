import { Issue, Manifest, type ManifestToValidate } from "@kosko/generate";
import type { RuleContext, RuleFactory } from "./rules/types";
import assert from "node:assert";

export interface ReportedIssue {
  manifest: ManifestToValidate;
  message: string;
}

export interface TestContext<T> extends RuleContext<T> {
  issues: ReportedIssue[];
}

export function createTestContext<T>(config: T): TestContext<T> {
  const issues: ReportedIssue[] = [];

  return {
    config,
    severity: "error",
    issues,
    report(manifest, message) {
      issues.push({ manifest, message });
    }
  };
}

export function createManifest(
  value: unknown
): ManifestToValidate & Pick<Manifest, "issues"> {
  const issues: Issue[] = [];

  return {
    path: "",
    index: [],
    data: value,
    issues,
    report(issue) {
      issues.push(issue);
    }
  };
}

export function validate<T>(
  rule: RuleFactory<T>,
  config: T,
  manifest: ManifestToValidate
): ReportedIssue[] {
  const ctx = createTestContext(config);
  const { validate } = rule.factory(ctx);

  assert(typeof validate === "function");
  validate(manifest);

  return ctx.issues;
}

export function validateAll<T>(
  rule: RuleFactory<T>,
  config: T,
  manifests: readonly ManifestToValidate[]
): ReportedIssue[] {
  const ctx = createTestContext(config);
  const { validateAll } = rule.factory(ctx);

  assert(typeof validateAll === "function");
  validateAll(manifests);

  return ctx.issues;
}
