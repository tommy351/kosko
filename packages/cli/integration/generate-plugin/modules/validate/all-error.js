/** @type import("@kosko/plugin").PluginFactory */
module.exports = () => ({
  validateAllManifests() {
    throw new Error("oops");
  }
});
