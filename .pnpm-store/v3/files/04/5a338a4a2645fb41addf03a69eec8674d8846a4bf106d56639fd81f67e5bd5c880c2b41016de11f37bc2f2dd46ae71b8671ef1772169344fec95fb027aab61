'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _utils = require('../../utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (actual, expected) => () => `${(0, _jestMatcherUtils.matcherHint)('.not.toBeArrayOfSize')}

Expected value to not be an array of size:
  ${(0, _jestMatcherUtils.printExpected)(expected)}
Received:
  value: ${(0, _jestMatcherUtils.printReceived)(actual)}
  length: ${(0, _jestMatcherUtils.printReceived)((0, _utils.determinePropertyMessage)(actual, 'length'))}`;

const failMessage = (actual, expected) => () => `${(0, _jestMatcherUtils.matcherHint)('.toBeArrayOfSize')}

Expected value to be an array of size:
  ${(0, _jestMatcherUtils.printExpected)(expected)}
Received:
  value: ${(0, _jestMatcherUtils.printReceived)(actual)}
  length: ${(0, _jestMatcherUtils.printReceived)((0, _utils.determinePropertyMessage)(actual, 'length'))}`;

exports.default = {
  toBeArrayOfSize: (actual, expected) => {
    const pass = (0, _predicate2.default)(actual, expected);
    if (pass) {
      return { pass: true, message: passMessage(actual, expected) };
    }

    return { pass: false, message: failMessage(actual, expected) };
  }
};