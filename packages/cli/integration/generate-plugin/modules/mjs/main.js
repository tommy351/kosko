/** @type import("@kosko/plugin").PluginFactory */
export default (ctx) => ({
  transformManifest(manifest) {
    return {
      ...manifest.data,
      metadata: {
        ...manifest.data.metadata,
        ...ctx.config
      }
    };
  }
});
