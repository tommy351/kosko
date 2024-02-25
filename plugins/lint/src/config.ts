import { validateConfig as validate } from "@kosko/plugin";
import { presets } from "./presets/registry";
import { Infer, enums, object, optional, partial } from "superstruct";
import { rules } from "./rules/registry";

const rulesSchema = object(
  Object.fromEntries(
    Object.entries(rules).map(([key, rule]) => [
      key,
      object({
        severity: optional(enums(["error", "warning", "off"])),
        ...(rule.config && { config: rule.config })
      })
    ])
  )
);

const configSchema = object({
  rules: partial(rulesSchema),
  preset: optional(enums(Object.keys(presets)))
});

export function validateConfig(value: unknown): Infer<typeof configSchema> {
  const config = validate(value, configSchema);
  const preset = config.preset ? presets[config.preset] : undefined;

  return {
    ...config,
    rules: {
      ...preset?.rules,
      ...config.rules
    }
  };
}
