"use strict";

const generate = require("@babel/generator").default;
const prettier = require("./prettier");

module.exports = function (ast, code) {
  const result = generate(
    ast,
    {
      compact: false,
      retainLines: true,
      retainFunctionParens: true,
      comments: true
    },
    code
  );

  return prettier(result.code);
};
