import {
  array,
  string,
  object,
  assign,
  optional,
  record,
  boolean,
  integer,
  min,
  unknown
} from "superstruct";

/**
 * Plugin config type.
 *
 * @public
 */
export interface PluginConfig {
  name: string;
  config?: unknown;
}

export const pluginConfigSchema = object({
  name: string(),
  config: optional(unknown())
});

/**
 * Environment config type.
 *
 * @public
 */
export interface EnvironmentConfig {
  require?: string[];
  components?: string[];
  loaders?: string[];
  plugins?: PluginConfig[];
}

export const environmentConfigSchema = object({
  require: optional(array(string())),
  components: optional(array(string())),
  loaders: optional(array(string())),
  plugins: optional(array(pluginConfigSchema))
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
  concurrency?: number;
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
    bail: optional(boolean()),
    concurrency: optional(min(integer(), 1))
  })
);
