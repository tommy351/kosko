import {
  array,
  string,
  object,
  assign,
  optional,
  record,
  boolean
} from "superstruct";

/**
 * Environment config type.
 *
 * @public
 */
export interface EnvironmentConfig {
  require?: string[];
  components?: string[];
  loaders?: string[];
}

export const environmentConfigSchema = object({
  require: optional(array(string())),
  components: optional(array(string())),
  loaders: optional(array(string()))
});

/**
 * Global config type.
 *
 * @public
 */
export interface Config extends EnvironmentConfig {
  environments?: Record<string, EnvironmentConfig>;
  paths?: {
    environment?: {
      global?: string;
      component?: string;
    };
  };
  extensions?: string[];
  baseEnvironment?: string;
  bail?: boolean;
}

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
