import type { PluginContext, Plugin } from "@kosko/plugin";
import type {
  RuleContext,
  RuleFactory,
  ValidateAllFunc,
  ValidateFunc
} from "./rules/types";
import { rules } from "./rules/registry";
import { validateConfig } from "./config";
import { ManifestStore } from "./utils/manifest-store";

/**
 * @public
 */
export default async function (ctx: PluginContext): Promise<Plugin> {
  const config = await validateConfig(ctx);
  const validateRules: ValidateFunc[] = [];
  const validateAllRules: ValidateAllFunc[] = [];
  const ruleConfigs = config.rules ?? {};

  for (const [key, rule] of Object.entries(
    rules as Record<string, RuleFactory<any>>
  )) {
    const ruleConfig = ruleConfigs[key];
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
        const store = new ManifestStore(manifests);

        for (const validate of validateAllRules) {
          validate(store);
        }
      }
    })
  };
}
