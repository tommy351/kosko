import { PluginFactory } from "@kosko/plugin";
import {
  object,
  record,
  string,
  unknown,
  boolean,
  defaulted,
  assert
} from "superstruct";
import deepMerge from "deepmerge";

const schema = object({
  metadata: record(string(), unknown()),
  override: defaulted(boolean(), false)
});

const factory: PluginFactory = (ctx, options) => {
  assert(options, schema);

  return {
    hooks: {
      transformManifest(manifest) {
        if (manifest != null && typeof manifest === "object") {
          (manifest as any).metadata = deepMerge(
            (manifest as any).metadata,
            options.metadata,
            {
              customMerge: () => (x, y) => options.override ? y : x
            }
          );
        }

        return manifest;
      }
    }
  };
};

export default factory;
