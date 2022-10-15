/* eslint-disable node/no-unpublished-require */
"use strict";

const path = require("node:path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "../__fixtures__/environment/index.js"),
  output: {
    path: path.join(__dirname, "dist")
  },
  experiments: {
    topLevelAwait: true
  },
  resolve: {
    alias: {
      "@kosko/env": path.join(__dirname, "../../../packages/env"),
      "@kosko/generate": path.join(__dirname, "../../../packages/generate")
    }
  }
};
