'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (item, list) => () => (0, _jestMatcherUtils.matcherHint)('.not.toBeOneOf', 'item', 'list') + '\n\n' + 'Expected value to not be in list:\n' + `  ${(0, _jestMatcherUtils.printExpected)(list)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(item)}`;

const failMessage = (item, list) => () => (0, _jestMatcherUtils.matcherHint)('.toBeOneOf', 'item', 'list') + '\n\n' + 'Expected value to be in list:\n' + `  ${(0, _jestMatcherUtils.printExpected)(list)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(item)}`;

exports.default = {
  toBeOneOf: (item, list) => {
    const pass = (0, _predicate2.default)(item, list);
    if (pass) {
      return { pass: true, message: passMessage(item, list) };
    }

    return { pass: false, message: failMessage(item, list) };
  }
};