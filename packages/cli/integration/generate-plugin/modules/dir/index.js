/** @type import("@kosko/plugin").PluginFactory */
module.exports = (ctx) => ({
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
