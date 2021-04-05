'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (number, start, end) => () => (0, _jestMatcherUtils.matcherHint)('.not.toBeWithin') + '\n\n' + 'Expected number to not be within start (inclusive) and end (exclusive):\n' + `  start: ${(0, _jestMatcherUtils.printExpected)(start)}  end: ${(0, _jestMatcherUtils.printExpected)(end)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(number)}`;

const failMessage = (number, start, end) => () => (0, _jestMatcherUtils.matcherHint)('.toBeWithin') + '\n\n' + 'Expected number to be within start (inclusive) and end (exclusive):\n' + `  start: ${(0, _jestMatcherUtils.printExpected)(start)}  end: ${(0, _jestMatcherUtils.printExpected)(end)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(number)}`;

exports.default = {
  toBeWithin: (number, start, end) => {
    const pass = (0, _predicate2.default)(number, start, end);
    if (pass) {
      return { pass: true, message: passMessage(number, start, end) };
    }

    return { pass: false, message: failMessage(number, start, end) };
  }
};