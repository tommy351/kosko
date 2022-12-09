/* eslint-disable node/no-unpublished-require */
"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("node:path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  plugins: [new HtmlWebpackPlugin()]
};
