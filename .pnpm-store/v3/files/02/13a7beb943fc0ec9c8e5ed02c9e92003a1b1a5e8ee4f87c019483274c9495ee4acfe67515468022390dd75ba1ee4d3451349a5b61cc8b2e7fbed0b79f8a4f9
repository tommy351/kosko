'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (received, after) => () => (0, _jestMatcherUtils.matcherHint)('.not.toBeAfter', 'received', '') + '\n\n' + `Expected date to be after ${(0, _jestMatcherUtils.printReceived)(after)} but received:\n` + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

const failMessage = (received, after) => () => (0, _jestMatcherUtils.matcherHint)('.toBeAfter', 'received', '') + '\n\n' + `Expected date to be after ${(0, _jestMatcherUtils.printReceived)(after)} but received:\n` + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

exports.default = {
  toBeAfter: (date, after) => {
    const pass = (0, _predicate2.default)(date, after);
    if (pass) {
      return { pass: true, message: passMessage(date, after) };
    }

    return { pass: false, message: failMessage(date, after) };
  }
};