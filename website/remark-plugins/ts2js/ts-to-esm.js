"use strict";

const { transform } = require("sucrase");

function tsToEsm(input) {
  const result = transform(input, {
    transforms: ["typescript"],
    disableESTransforms: true
  });

  return result.code.trim();
}

module.exports = tsToEsm;
