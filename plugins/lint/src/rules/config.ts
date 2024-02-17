import { Struct, enums, object, optional } from "superstruct";
import noMissingNamespace from "./no-missing-namespace";
import noMissingVolumeMounts from "./no-missing-volume-mounts";
import { Severity } from "./base";

export const rules = {
  "no-missing-volume-mounts": noMissingVolumeMounts,
  "no-missing-namespace": noMissingNamespace
};

type ExtractStructType<S> = S extends Struct<infer T> ? T : never;

interface RuleConfig<T> {
  severity?: Severity;
  config?: T;
}

export type RulesConfig = {
  [K in keyof typeof rules]: RuleConfig<
    ExtractStructType<(typeof rules)[K]["config"]>
  >;
};

export function buildRulesSchema() {
  return object(
    Object.fromEntries(
      Object.entries(rules).map(([key, rule]) => [
        key,
        optional(
          object({
            severity: optional(enums(Object.values(Severity) as Severity[])),
            ...(rule.config && { config: rule.config })
          })
        )
      ])
    )
  );
}
