/** @type import("@kosko/plugin").PluginFactory */
export default (ctx) => ({
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
