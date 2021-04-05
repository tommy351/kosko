'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (received, expected) => () => {
  return (0, _jestMatcherUtils.matcherHint)('.not.toEqualCaseInsensitive') + '\n\n' + 'Expected values to not be equal while ignoring case (using ===):\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;
};

const failMessage = (received, expected) => () => {
  return (0, _jestMatcherUtils.matcherHint)('.toEqualCaseInsensitive') + '\n\n' + 'Expected values to be equal while ignoring case (using ===):\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;
};

exports.default = {
  toEqualCaseInsensitive(received, expected) {
    const pass = (0, _predicate2.default)(received, expected);

    return {
      pass,
      message: pass ? passMessage(received, expected) : failMessage(received, expected),
      actual: received
    };
  }
};