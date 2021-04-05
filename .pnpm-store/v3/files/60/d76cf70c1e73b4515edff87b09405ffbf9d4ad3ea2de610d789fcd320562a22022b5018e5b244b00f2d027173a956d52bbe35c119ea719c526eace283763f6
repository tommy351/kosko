'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (received, before) => () => (0, _jestMatcherUtils.matcherHint)('.not.toBeBefore', 'received', '') + '\n\n' + `Expected date to be before ${(0, _jestMatcherUtils.printReceived)(before)} but received:\n` + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

const failMessage = (received, before) => () => (0, _jestMatcherUtils.matcherHint)('.toBeBefore', 'received', '') + '\n\n' + `Expected date to be before ${(0, _jestMatcherUtils.printReceived)(before)} but received:\n` + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

exports.default = {
  toBeBefore: (date, before) => {
    const pass = (0, _predicate2.default)(date, before);
    if (pass) {
      return { pass: true, message: passMessage(date, before) };
    }

    return { pass: false, message: failMessage(date, before) };
  }
};