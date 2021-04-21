/* eslint-disable node/no-unpublished-require */
"use strict";

const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

module.exports = function () {
  return {
    name: "lodash-webpack-plugin",
    configureWebpack() {
      return {
        plugins: [new LodashModuleReplacementPlugin()]
      };
    }
  };
};
