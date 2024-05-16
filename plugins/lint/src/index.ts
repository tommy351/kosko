import type { PluginContext, Plugin } from "@kosko/plugin";
import type { Manifest as BaseManifest } from "@kosko/generate";
import type {
  Manifest,
  RuleContext,
  RuleFactory,
  ValidateAllFunc,
  ValidateFunc
} from "./rules/types";
import { rules } from "./rules/registry";
import { SEVERITY_OFF, validateConfig } from "./config";
import { ManifestStore } from "./utils/manifest-store";
import { buildDisabledRuleMatcher } from "./utils/manifest";

function createManifest(manifest: BaseManifest): Manifest {
  return {
    ...manifest,
    isRuleDisabled: buildDisabledRuleMatcher(manifest)
  };
}

/**
 * @public
 */
export default async function (ctx: PluginContext): Promise<Plugin> {
  const config = await validateConfig(ctx);
  const validateRules: Record<string, ValidateFunc> = {};
  const validateAllRules: ValidateAllFunc[] = [];
  const ruleConfigs = config.rules ?? {};

  for (const [key, rule] of Object.entries(
    rules as Record<string, RuleFactory<any>>
  )) {
    const ruleConfig = ruleConfigs[key];
    if (!ruleConfig) continue;

    const severity = ruleConfig.severity ?? SEVERITY_OFF;
    if (severity === SEVERITY_OFF) continue;

    const ruleCtx: RuleContext<any> = {
      config: ruleConfig.config,
      severity,
      report(manifest, message) {
        if (manifest.isRuleDisabled(key)) return;

        manifest.report({
          severity,
          message: `${key}: ${message}`
        });
      }
    };

    const { validate, validateAll } = rule.factory(ruleCtx);

    if (typeof validate === "function") {
      validateRules[key] = validate;
    }

    if (typeof validateAll === "function") {
      validateAllRules.push(validateAll);
    }
  }

  return {
    ...(Object.keys(validateRules).length && {
      validateManifest(base) {
        const manifest = createManifest(base);

        for (const [key, validate] of Object.entries(validateRules)) {
          if (!manifest.isRuleDisabled(key)) validate(manifest);
        }
      }
    }),
    ...(validateAllRules.length && {
      validateAllManifests(manifests) {
        const store = new ManifestStore(
          manifests.map((manifest) => createManifest(manifest))
        );

        for (const validate of validateAllRules) {
          validate(store);
        }
      }
    })
  };
}
