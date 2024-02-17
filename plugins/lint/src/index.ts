import type { Plugin, PluginContext } from "@kosko/plugin";
import { validateConfig } from "./config";
import {
  Severity,
  type FullValidateResult,
  type RuleContext
} from "./rules/base";
import type { Manifest, Result } from "@kosko/generate";
import { createError } from "./error";
import { rules } from "./rules/config";

/**
 * @public
 */
export default function (ctx: PluginContext): Plugin {
  const config = validateConfig(ctx.config);
  const manifestValidators: ((manifest: Manifest) => FullValidateResult[])[] =
    [];
  const resultValidators: ((result: Result) => FullValidateResult[])[] = [];

  for (const [name, rule] of Object.entries(rules)) {
    const ruleConf = config.rules?.[name];
    if (!ruleConf) continue;

    const severity = ruleConf.severity;
    if (!severity || severity === Severity.Off) continue;

    const ruleCtx: RuleContext<any> = { config: ruleConf.config };
    const { validate, validateAll } = rule;

    if (typeof validate === "function") {
      manifestValidators.push((manifest) =>
        validate(ruleCtx, manifest).map((result) => ({
          ...result,
          rule: name,
          manifest,
          severity
        }))
      );
    }

    if (typeof validateAll === "function") {
      resultValidators.push((result) =>
        validateAll(ruleCtx, result).map((validateResult) => ({
          ...validateResult,
          rule: name,
          severity
        }))
      );
    }
  }

  return {
    validateManifest(manifest) {
      const results = manifestValidators.flatMap((v) => v(manifest));

      if (results.length) {
        throw createError(results);
      }
    },
    validateAllManifests(result) {
      const results = resultValidators.flatMap((v) => v(result));

      if (results.length) {
        throw createError(results);
      }
    }
  };
}
