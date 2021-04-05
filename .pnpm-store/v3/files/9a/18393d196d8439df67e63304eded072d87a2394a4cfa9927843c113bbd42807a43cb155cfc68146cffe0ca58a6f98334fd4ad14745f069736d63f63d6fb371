'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (prefix, string) => () => (0, _jestMatcherUtils.matcherHint)('.not.toStartWith') + '\n\n' + 'Expected string to not start with:\n' + `  ${(0, _jestMatcherUtils.printExpected)(prefix)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(string)}`;

const failMessage = (prefix, string) => () => (0, _jestMatcherUtils.matcherHint)('.toStartWith') + '\n\n' + 'Expected string to start with:\n' + `  ${(0, _jestMatcherUtils.printExpected)(prefix)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(string)}`;

exports.default = {
  toStartWith: (string, prefix) => {
    const pass = (0, _predicate2.default)(prefix, string);
    if (pass) {
      return { pass: true, message: passMessage(prefix, string) };
    }

    return { pass: false, message: failMessage(prefix, string) };
  }
};