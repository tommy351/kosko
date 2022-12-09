"use strict";

const prettier = require("prettier");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const config = JSON.parse(
  readFileSync(join(__dirname, "../../../.prettierrc"), "utf8")
);

config.parser = "babel";

module.exports = function (input) {
  return prettier.format(input, config).trim();
};
