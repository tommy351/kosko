"use strict";

const { readFile } = require("node:fs/promises");
const { join } = require("node:path");

module.exports = function () {
  return {
    name: "lint-rules-metadata-plugin",
    async contentLoaded({ actions }) {
      const content = await readFile(
        join(__dirname, "../../tmp/lint-rules-metadata.json"),
        "utf-8"
      );
      actions.setGlobalData(JSON.parse(content));
    }
  };
};
