'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = received => () => {
  return (0, _jestMatcherUtils.matcherHint)('.not.toBeExtensible', 'received', '') + '\n\n' + 'Expected value to not be extensible received:\n' + `  ${(0, _jestMatcherUtils.printExpected)(received)}\n`;
};

const failMessage = received => () => {
  return (0, _jestMatcherUtils.matcherHint)('.toBeExtensible', 'received', '') + '\n\n' + 'Expected value to be extensible received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;
};

exports.default = {
  toBeExtensible(expected) {
    const pass = (0, _predicate2.default)(expected);
    return {
      pass,
      message: pass ? passMessage(expected) : failMessage(expected)
    };
  }
};