/** @type import("@kosko/plugin").PluginFactory */
module.exports = (ctx) => ({
  validateManifest(manifest) {
    for (const issue of ctx.config?.issues ?? []) {
      manifest.report(issue);
    }
  }
});
