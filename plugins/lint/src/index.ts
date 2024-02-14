import type {
  PluginContext,
  Plugin,
  ValidateAllManifests
} from "@kosko/plugin";
import { assert, object, optional } from "superstruct";
import { Registry } from "./registry";
import danglingIngress from "./rules/dangling-ingress";

const registry = new Registry();

registry.register(danglingIngress);

const configSchema = object({
  rules: optional(registry.buildRulesSchema())
});

export default function (ctx: PluginContext): Plugin {
  const config = ctx.config;
  assert(config, configSchema);

  const validators: ValidateAllManifests[] = [];

  for (const rule of registry.getRules()) {
    const ruleConfig = config.rules?.[rule.name];

    if (ruleConfig?.enabled) {
      validators.push(rule.rule({ config: ruleConfig.config }));
    }
  }

  return {
    async validateAllManifests(result) {
      for (const validate of validators) {
        await validate(result);
      }
    }
  };
}
