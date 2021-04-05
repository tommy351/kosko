'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

const passMessage = (received, expected) => () => (0, _jestMatcherUtils.matcherHint)('.not.toSatisfy', 'received', '') + '\n\n' + 'Expected value to not satisfy:\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

const failMessage = (received, expected) => () => (0, _jestMatcherUtils.matcherHint)('.toSatisfy', 'received', '') + '\n\n' + 'Expected value to satisfy:\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

exports.default = {
  toSatisfy: (actual, predicate) => {
    const pass = predicate(actual);
    if (pass) {
      return { pass: true, message: passMessage(actual, predicate) };
    }

    return { pass: false, message: failMessage(actual, predicate) };
  }
};