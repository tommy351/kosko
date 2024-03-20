/** @type import("@kosko/plugin").PluginFactory */
module.exports = (ctx) => ({
  validateAllManifests(manifests) {
    for (const manifest of manifests) {
      for (const issue of ctx.config?.issues ?? []) {
        manifest.report(issue);
      }
    }
  }
});
