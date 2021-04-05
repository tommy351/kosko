'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (object, entries) => () => (0, _jestMatcherUtils.matcherHint)('.not.toContainAnyEntries') + '\n\n' + 'Expected object to not contain any of the provided entries:\n' + `  ${(0, _jestMatcherUtils.printExpected)(entries)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(object)}`;

const failMessage = (object, entries) => () => (0, _jestMatcherUtils.matcherHint)('.toContainAnyEntries') + '\n\n' + 'Expected object to contain any of the provided entries:\n' + `  ${(0, _jestMatcherUtils.printExpected)(entries)}\n` + 'Received:\n' + `  ${(0, _jestMatcherUtils.printReceived)(object)}`;

exports.default = {
  toContainAnyEntries: (object, entries) => {
    const pass = (0, _predicate2.default)(object, entries);
    if (pass) {
      return { pass: true, message: passMessage(object, entries) };
    }
    return { pass: false, message: failMessage(object, entries) };
  }
};