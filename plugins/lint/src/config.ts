import { Infer, object, optional } from "superstruct";
import { validateConfig as validate } from "@kosko/plugin";
import { buildPresetSchema, presets } from "./presets/config";
import { buildRulesSchema } from "./rules/config";
import { Preset } from "./presets/base";

const schema = object({
  preset: optional(buildPresetSchema()),
  rules: optional(buildRulesSchema())
});

type Config = Infer<typeof schema>;

function applyPreset(config: Config, preset: Preset) {
  if (!config.rules) {
    config.rules = {};
  }

  for (const [name, rule] of Object.entries(preset.rules)) {
    if (config.rules[name] == null) {
      config.rules[name] = rule;
    }
  }
}

export function validateConfig(value: unknown): Config {
  const config = validate(value, schema);

  if (config.preset) {
    const preset = presets[config.preset];
    applyPreset(config, preset);
  }

  return config;
}
