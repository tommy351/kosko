'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = received => () => (0, _jestMatcherUtils.matcherHint)('.not.toBeBoolean', 'received', '') + '\n\n' + 'Expected value to not be of type boolean, received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

const failMessage = received => () => (0, _jestMatcherUtils.matcherHint)('.toBeBoolean', 'received', '') + '\n\n' + 'Expected value to be of type boolean, received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}`;

exports.default = {
  toBeBoolean: received => {
    const pass = (0, _predicate2.default)(received);
    if (pass) {
      return { pass: true, message: passMessage(received) };
    }

    return { pass: false, message: failMessage(received) };
  }
};