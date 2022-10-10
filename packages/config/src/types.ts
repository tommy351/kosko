import {
  array,
  string,
  object,
  Infer,
  assign,
  optional,
  record,
  boolean
} from "superstruct";

export const environmentConfigSchema = object({
  require: optional(array(string())),
  components: optional(array(string())),
  loaders: optional(array(string()))
});

export type EnvironmentConfig = Infer<typeof environmentConfigSchema>;

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
    baseEnvironment: optional(string()),
    bail: optional(boolean())
  })
);

export type Config = Infer<typeof configSchema>;
