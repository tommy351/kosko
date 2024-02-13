/** @type import("@kosko/plugin").PluginFactory */
module.exports = () => ({
  transformManifest: () => {
    throw new Error("oops");
  }
});
