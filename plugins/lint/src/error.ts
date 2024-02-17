import type { FullValidateResult } from "./rules/base";

const STACK_INDENT = "    ";

class LintError extends Error {
  public constructor(result: FullValidateResult) {
    super("Lint error");

    this.stack = `${this.name}: ${result.message}
${STACK_INDENT}Rule: ${result.rule}
${STACK_INDENT}Path: ${result.path.join(".")}`;
  }
}

LintError.prototype.name = "LintError";

export function createError(results: readonly FullValidateResult[]) {
  const errs = results.map((result) => new LintError(result));

  if (errs.length === 1) {
    return errs[0];
  }

  return new AggregateError(errs);
}
