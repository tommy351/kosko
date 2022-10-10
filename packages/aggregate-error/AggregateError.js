"use strict";

class AggregateError extends Error {
  constructor(errors, message, options = {}) {
    super(message);

    Object.defineProperty(this, "errors", {
      value: [...errors],
      enumerable: false
    });

    Object.defineProperty(this, "cause", {
      value: options.cause,
      enumerable: false
    });
  }
}

AggregateError.prototype.name = "AggregateError";

module.exports = AggregateError;
