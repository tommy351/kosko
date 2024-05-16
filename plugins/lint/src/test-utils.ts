import type { Manifest as BaseManifest, Issue } from "@kosko/generate";
import type { Manifest, RuleContext, RuleFactory } from "./rules/types";
import assert from "node:assert";
import { ManifestStore } from "./utils/manifest-store";
import { getManifestMeta } from "@kosko/common-utils";
import { buildDisabledRuleMatcher } from "./utils/manifest";

export interface ReportedIssue {
  manifest: Manifest;
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

export function createManifest(value: unknown): Manifest {
  const issues: Issue[] = [];
  const manifest: BaseManifest = {
    position: { path: "", index: [] },
    data: value,
    issues,
    metadata: getManifestMeta(value),
    report(issue) {
      issues.push(issue);
    }
  };

  return {
    ...manifest,
    isRuleDisabled: buildDisabledRuleMatcher(manifest)
  };
}

export function validate<T>(
  rule: RuleFactory<T>,
  config: T | undefined,
  manifest: Manifest
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
  manifests: readonly Manifest[]
): ReportedIssue[] {
  const ctx = createTestContext(config);
  const { validateAll } = rule.factory(ctx);

  assert(typeof validateAll === "function");

  const store = new ManifestStore(manifests);
  validateAll(store);

  return ctx.issues;
}
