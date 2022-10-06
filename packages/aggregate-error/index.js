"use strict";

if (typeof AggregateError === "undefined") {
  module.exports = require("./AggregateError");
} else {
  // eslint-disable-next-line no-undef
  module.exports = AggregateError;
}
