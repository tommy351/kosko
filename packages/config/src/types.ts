import {
  array,
  string,
  object,
  Infer,
  assign,
  optional,
  record,
  any
} from "superstruct";
import { ReadonlyDeep } from "type-fest";

export const pluginConfigSchema = object({
  name: string(),
  options: optional(any())
});

export type PluginConfig = ReadonlyDeep<Infer<typeof pluginConfigSchema>>;

export const environmentConfigSchema = object({
  require: optional(array(string())),
  components: optional(array(string())),
  plugins: optional(array(pluginConfigSchema))
});

export type EnvironmentConfig = ReadonlyDeep<
  Infer<typeof environmentConfigSchema>
>;

export const configSchema = assign(
  environmentConfigSchema,
  object({
    environments: optional(record(string(), environmentConfigSchema)),
    paths: optional(
      object({
        environment: optional(
          object({
            global: optional(string()),
            component: optional(string())
          })
        )
      })
    ),
    extensions: optional(array(string())),
    baseEnvironment: optional(string())
  })
);

export type Config = ReadonlyDeep<Infer<typeof configSchema>>;
