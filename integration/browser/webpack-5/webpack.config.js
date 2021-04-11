/* eslint-disable node/no-unpublished-require */
"use strict";

const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist")
  },
  experiments: {
    topLevelAwait: true
  }
};
