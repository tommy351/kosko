import { isRecord } from "@kosko/common-utils";
import { type Plugin, type PluginContext, validateConfig } from "@kosko/plugin";
import {
  Infer,
  array,
  assert,
  boolean,
  object,
  optional,
  string
} from "superstruct";
import type { ReadonlyDeep } from "type-fest";

const keyValuePairSchema = object({
  name: string(),
  value: string(),
  override: optional(boolean())
});

type KeyValueList = Infer<typeof keyValueListSchema>;

const keyValueListSchema = array(keyValuePairSchema);

const namespaceSchema = object({
  value: string(),
  override: optional(boolean())
});

const nameSchema = object({
  prefix: optional(string()),
  suffix: optional(string())
});

const configSchema = object({
  namespace: optional(namespaceSchema),
  name: optional(nameSchema),
  labels: optional(keyValueListSchema),
  annotations: optional(keyValueListSchema)
});

interface Metadata {
  [key: string]: unknown;
}

interface Transformer {
  (metadata: Metadata): void;
}

function transformNamespace(
  config: Infer<typeof namespaceSchema>
): Transformer {
  return (metadata) => {
    metadata.namespace = config.override
      ? config.value
      : metadata.namespace || config.value;
  };
}

function transformName(config: Infer<typeof nameSchema>): Transformer {
  // If both prefix and suffix are not defined, return a noop function
  if (!config.prefix && !config.suffix) {
    return () => {};
  }

  return (metadata) => {
    if (typeof metadata.name !== "string") return;

    metadata.name = `${config.prefix ?? ""}${metadata.name}${config.suffix ?? ""}`;
  };
}

function setKeyValueList(data: unknown, list: ReadonlyDeep<KeyValueList>) {
  if (typeof data !== "object" && typeof data !== "undefined") {
    return data;
  }

  const result: Record<string, unknown> = { ...data };

  for (const entry of list) {
    result[entry.name] = entry.override
      ? entry.value
      : result[entry.name] ?? entry.value;
  }

  return result;
}

function transformLabels(config: ReadonlyDeep<KeyValueList>): Transformer {
  if (!config.length) return () => {};

  return (metadata) => {
    metadata.labels = setKeyValueList(metadata.labels, config);
  };
}

function transformAnnotations(config: ReadonlyDeep<KeyValueList>): Transformer {
  if (!config.length) return () => {};

  return (metadata) => {
    metadata.annotations = setKeyValueList(metadata.annotations, config);
  };
}

/**
 * @public
 */
export default function (ctx: PluginContext): Plugin {
  const config = validateConfig(ctx.config, configSchema);
  const transformers: Transformer[] = [];

  if (config.namespace) {
    transformers.push(transformNamespace(config.namespace));
  }

  if (config.name) {
    transformers.push(transformName(config.name));
  }

  if (config.labels?.length) {
    transformers.push(transformLabels(config.labels));
  }

  if (config.annotations?.length) {
    transformers.push(transformAnnotations(config.annotations));
  }

  if (!transformers.length) {
    return {};
  }

  return {
    transformManifest(result) {
      if (!isRecord(result.data) || !isRecord(result.data.metadata)) {
        return result.data;
      }

      for (const transform of transformers) {
        transform(result.data.metadata);
      }

      return result.data;
    }
  };
}
