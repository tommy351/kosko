import {
  type PluginContext,
  type Plugin,
  ValidateManifest,
  ValidateAllManifests
} from "@kosko/plugin";
import type { RuleContext, RuleFactory } from "./rules/types";
import { rules } from "./rules/registry";
import { validateConfig } from "./config";

/**
 * @public
 */
export default function (ctx: PluginContext): Plugin {
  const config = validateConfig(ctx.config);
  const validateRules: ValidateManifest[] = [];
  const validateAllRules: ValidateAllManifests[] = [];

  for (const [key, rule] of Object.entries(
    rules as Record<string, RuleFactory<any>>
  )) {
    const ruleConfig = config.rules[key];
    if (!ruleConfig) continue;

    const severity = ruleConfig.severity ?? "off";
    if (severity === "off") continue;

    const ruleCtx: RuleContext<any> = {
      config: ruleConfig.config,
      severity,
      report(manifest, message) {
        manifest.report({
          severity,
          message: `${key}: ${message}`
        });
      }
    };

    const { validate, validateAll } = rule.factory(ruleCtx);

    if (typeof validate === "function") {
      validateRules.push(validate);
    }

    if (typeof validateAll === "function") {
      validateAllRules.push(validateAll);
    }
  }

  return {
    ...(validateRules.length && {
      validateManifest(manifest) {
        for (const validate of validateRules) {
          validate(manifest);
        }
      }
    }),
    ...(validateAllRules.length && {
      validateAllManifests(manifests) {
        for (const validate of validateAllRules) {
          validate(manifests);
        }
      }
    })
  };
}
