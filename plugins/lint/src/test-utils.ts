import type { Issue, Manifest, ManifestToValidate } from "@kosko/generate";
import type { RuleContext, RuleFactory } from "./rules/types";
import assert from "node:assert";
import { ManifestStore } from "./utils/manifest-store";
import { getManifestMeta } from "@kosko/common-utils";

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
    position: { path: "", index: [] },
    data: value,
    issues,
    metadata: getManifestMeta(value),
    report(issue) {
      issues.push(issue);
    }
  };
}

export function validate<T>(
  rule: RuleFactory<T>,
  config: T | undefined,
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
  config: T | undefined,
  manifests: readonly ManifestToValidate[]
): ReportedIssue[] {
  const ctx = createTestContext(config);
  const { validateAll } = rule.factory(ctx);

  assert(typeof validateAll === "function");

  const store = new ManifestStore(manifests);
  validateAll(store);

  return ctx.issues;
}
