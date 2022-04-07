"use strict";

const { transform } = require("sucrase");
const prettier = require("./prettier");

function tsToEsm(input) {
  const result = transform(input, {
    transforms: ["typescript"],
    disableESTransforms: true
  });

  return prettier(result.code);
}

module.exports = tsToEsm;
