import { PluginFactory } from "@kosko/plugin";

const factory: PluginFactory = (ctx) => ({
  transformManifest(manifest) {
    const data = manifest.data as any;

    return {
      ...data,
      metadata: {
        ...data.metadata,
        ...(ctx.config as any)
      }
    };
  }
});

export default factory;
