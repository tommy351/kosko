/** @type import("@kosko/plugin").PluginFactory */
module.exports = () => ({
  validateManifest() {
    throw new Error("oops");
  }
});
