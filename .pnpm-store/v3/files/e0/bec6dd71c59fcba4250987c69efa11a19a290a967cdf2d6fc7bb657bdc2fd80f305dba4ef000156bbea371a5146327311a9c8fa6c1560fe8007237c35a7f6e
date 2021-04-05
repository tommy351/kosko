'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (actual, expected) => () => (0, _jestMatcherUtils.matcherHint)('.not.toContainAllKeys') + '\n\n' + 'Expected object to not contain all keys:\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(Object.keys(actual))}`;

const failMessage = (actual, expected) => () => (0, _jestMatcherUtils.matcherHint)('.toContainAllKeys') + '\n\n' + 'Expected object to contain all keys:\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(Object.keys(actual))}`;

exports.default = {
  toContainAllKeys: (actual, expected) => {
    const pass = (0, _predicate2.default)(actual, expected);
    if (pass) {
      return { pass: true, message: passMessage(actual, expected) };
    }

    return { pass: false, message: failMessage(actual, expected) };
  }
};