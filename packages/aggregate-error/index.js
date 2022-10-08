/* global AggregateError */
"use strict";

if (typeof AggregateError === "undefined") {
  module.exports = require("./AggregateError");
} else {
  module.exports = AggregateError;
}
