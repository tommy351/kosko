/** @type import("@kosko/plugin").PluginFactory */
module.exports = (ctx) => ({
  transformManifest(result) {
    return {
      ...result.data,
      metadata: {
        ...result.data.metadata,
        ...ctx.config
      }
    };
  }
});
