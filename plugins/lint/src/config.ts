import { PluginContext, validateConfig as validate } from "@kosko/plugin";
import {
  type Infer,
  coerce,
  enums,
  object,
  optional,
  partial,
  union,
  boolean,
  Struct,
  array,
  string
} from "superstruct";
import { rules } from "./rules/registry";
import type { RuleFactory } from "./rules/types";
import type { Severity } from "@kosko/generate";
import { importPath, resolveModule } from "@kosko/require";
import { dirname } from "node:path";

export const SEVERITY_OFF = "off";

export type SeverityAndOff = Severity | typeof SEVERITY_OFF;

const severityEnum = enums(["error", "warning", SEVERITY_OFF]);

const severityCoerceEnum = union([
  enums(["warn"]),
  enums([0, 1, 2]),
  boolean()
]);

function severityCoerce(
  value: Infer<typeof severityEnum> | Infer<typeof severityCoerceEnum>
): SeverityAndOff {
  switch (value) {
    case 0:
    case false:
      return SEVERITY_OFF;
    case "warn":
    case 1:
      return "warning";
    case true:
    case 2:
      return "error";
    default:
      return value;
  }
}

function buildRuleSchema(rule: RuleFactory<unknown>) {
  return coerce(
    object({
      severity: coerce(severityEnum, severityCoerceEnum, severityCoerce),
      config: optional((rule.config || object({})) as Struct)
    }),
    union([severityEnum, severityCoerceEnum]),
    (value) => ({ severity: severityCoerce(value) })
  );
}

const rulesSchema = object(
  Object.fromEntries(
    Object.entries(rules).map(([key, rule]) => [
      key,
      buildRuleSchema(rule as RuleFactory<unknown>)
    ])
  )
);

const configSchema = object({
  extends: optional(array(string())),
  rules: optional(partial(rulesSchema))
});

async function loadConfig(path: string) {
  try {
    return await importPath(path);
  } catch (err) {
    throw new Error(`Failed to load config from "${path}"`, { cause: err });
  }
}

export async function validateConfig(
  ctx: PluginContext
): Promise<Pick<Infer<typeof configSchema>, "rules">> {
  const config = validate(ctx.config, configSchema);
  const rules = {};

  for (const extend of config.extends ?? []) {
    const path = await resolveModule(extend, { baseDir: ctx.cwd });

    if (!path) {
      throw new Error(`Failed to resolve config path "${extend}"`);
    }

    const mod = await loadConfig(path);
    const extendConf = await validateConfig({
      cwd: dirname(path),
      config: mod?.default
    });

    Object.assign(rules, extendConf.rules);
  }

  Object.assign(rules, config.rules);

  return { rules };
}
