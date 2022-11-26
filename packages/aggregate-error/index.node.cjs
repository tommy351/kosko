/* global AggregateError */
"use strict";

module.exports =
  typeof AggregateError === "undefined"
    ? require("./dist/index.node.cjs").AggregateError
    : AggregateError;
