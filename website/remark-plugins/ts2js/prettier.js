"use strict";

const prettier = require("prettier");
const fs = require("node:fs");
const path = require("node:path");
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../../.prettierrc"), "utf8")
);

config.parser = "babel";

module.exports = function (input) {
  return prettier.format(input, config).trim();
};
