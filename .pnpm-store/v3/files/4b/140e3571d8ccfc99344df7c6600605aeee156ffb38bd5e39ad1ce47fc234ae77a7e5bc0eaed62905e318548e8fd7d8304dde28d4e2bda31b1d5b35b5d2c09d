'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (suffix, string) => () => (0, _jestMatcherUtils.matcherHint)('.not.toEndWith') + '\n\n' + 'Expected string to not end with:\n' + `  ${(0, _jestMatcherUtils.printExpected)(suffix)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(string)}`;

const failMessage = (suffix, string) => () => (0, _jestMatcherUtils.matcherHint)('.toEndWith') + '\n\n' + 'Expected string to end with:\n' + `  ${(0, _jestMatcherUtils.printExpected)(suffix)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(string)}`;

exports.default = {
  toEndWith: (string, suffix) => {
    const pass = (0, _predicate2.default)(suffix, string);
    if (pass) {
      return { pass: true, message: passMessage(suffix, string) };
    }

    return { pass: false, message: failMessage(suffix, string) };
  }
};