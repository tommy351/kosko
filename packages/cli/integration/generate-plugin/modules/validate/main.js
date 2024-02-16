const { Console } = require("node:console");

const logger = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});

/** @type import("@kosko/plugin").PluginFactory */
module.exports = (ctx) => {
  const config = ctx.config || {};

  function validate() {
    switch (config.error) {
      case "sync":
        throw new Error("Sync error");
      case "async":
        return Promise.reject(new Error("Async error"));
      default:
        logger.log("Validation succeeded");
    }
  }

  return {
    ...(config.test === "validate" && { validateManifest: validate }),
    ...(config.test === "validateAll" && { validateAllManifests: validate })
  };
};
