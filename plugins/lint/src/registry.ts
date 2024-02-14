import type { ValidateAllManifests } from "@kosko/plugin";
import { object, type Struct, optional, boolean } from "superstruct";
import type { ReadonlyDeep } from "type-fest";

export interface RuleContext<T> {
  config: T;
}

export interface Rule<T = unknown> {
  name: string;
  config?: Struct<T>;
  rule(ctx: RuleContext<T>): ValidateAllManifests;
}

export class Registry {
  private rules: Record<string, Rule> = {};

  public getRules(): ReadonlyDeep<Rule[]> {
    return Object.values(this.rules);
  }

  public register(rule: Rule): void {
    if (this.rules[rule.name]) {
      throw new Error(`Rule "${rule.name}" is already registered`);
    }

    this.rules[rule.name] = rule;
  }

  public buildRulesSchema() {
    const rules = Object.fromEntries(
      Object.values(this.rules).map((rule) => [
        rule.name,
        optional(
          object({
            enabled: optional(boolean()),
            ...(rule.config && { config: rule.config })
          })
        )
      ])
    );

    return object(rules);
  }
}
