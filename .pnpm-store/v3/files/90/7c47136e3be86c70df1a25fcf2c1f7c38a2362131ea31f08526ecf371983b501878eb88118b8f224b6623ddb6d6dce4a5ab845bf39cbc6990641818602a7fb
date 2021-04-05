'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (actual, expected, occurrences) => () => (0, _jestMatcherUtils.matcherHint)('.not.toIncludeRepeated') + '\n\n' + `Expected string to not include repeated ${occurrences} times:\n` + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(actual)}`;

const failMessage = (actual, expected, occurrences) => () => (0, _jestMatcherUtils.matcherHint)('.toIncludeRepeated') + '\n\n' + `Expected string to include repeated ${occurrences} times:\n` + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(actual)}`;

exports.default = {
  toIncludeRepeated: (actual, expected, occurrences) => {
    const pass = (0, _predicate2.default)(actual, expected, occurrences);
    if (pass) {
      return { pass: true, message: passMessage(actual, expected, occurrences) };
    }

    return { pass: false, message: failMessage(actual, expected, occurrences) };
  }
};