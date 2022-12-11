/* eslint-disable node/no-unpublished-require */
"use strict";

const { join } = require("node:path");

module.exports = {
  mode: "development",
  entry: join(__dirname, "../__fixtures__/environment/index.js"),
  output: {
    path: join(__dirname, "dist")
  },
  experiments: {
    topLevelAwait: true
  },
  resolve: {
    alias: {
      "@kosko/env": join(__dirname, "../../../packages/env"),
      "@kosko/generate": join(__dirname, "../../../packages/generate")
    }
  }
};
