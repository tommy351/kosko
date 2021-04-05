'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = received => () => (0, _jestMatcherUtils.matcherHint)('.not.toBeFalse', 'received', '') + '\n\n' + 'Expected value to not be false received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

const failMessage = received => () => (0, _jestMatcherUtils.matcherHint)('.toBeFalse', 'received', '') + '\n\n' + 'Expected value to be false:\n' + `  ${(0, _jestMatcherUtils.printExpected)(false)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

exports.default = {
  toBeFalse: expected => {
    const pass = (0, _predicate2.default)(expected);
    if (pass) {
      return { pass: true, message: passMessage(expected) };
    }

    return { pass: false, message: failMessage(expected) };
  }
};