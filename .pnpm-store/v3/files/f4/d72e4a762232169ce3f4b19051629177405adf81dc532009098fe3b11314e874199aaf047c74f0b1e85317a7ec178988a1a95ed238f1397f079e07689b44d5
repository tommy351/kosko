'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const positiveHint = (0, _jestMatcherUtils.matcherHint)('.toThrowWithMessage', 'function', 'type', { secondArgument: 'message' });
const negativeHint = (0, _jestMatcherUtils.matcherHint)('.not.toThrowWithMessage', 'function', 'type', { secondArgument: 'message' });

const passMessage = (received, expected) => () => negativeHint + '\n\n' + 'Expected not to throw:\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Thrown:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}\n`;

const failMessage = (received, expected) => () => positiveHint + '\n\n' + 'Expected to throw:\n' + `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` + 'Thrown:\n' + `  ${(0, _jestMatcherUtils.printReceived)(received)}\n`;

exports.default = {
  toThrowWithMessage: (callback, type, message) => {
    if (!callback || typeof callback !== 'function') {
      return {
        pass: false,
        message: () => positiveHint + '\n\n' + `Received value must be a function but instead "${callback}" was found`
      };
    }

    if (!type || typeof type !== 'function') {
      return {
        pass: false,
        message: () => positiveHint + '\n\n' + `Expected type to be a function but instead "${type}" was found`
      };
    }

    if (!message) {
      return {
        pass: false,
        message: () => positiveHint + '\n\n' + ' Message argument is required. '
      };
    }

    if (typeof message !== 'string' && !(message instanceof RegExp)) {
      return {
        pass: false,
        message: () => positiveHint + '\n\n' + 'Unexpected argument for message\n' + 'Expected: "string" or "regexp\n' + `Got: "${message}"`
      };
    }

    let error;
    try {
      callback();
    } catch (e) {
      error = e;
    }

    if (!error) {
      return {
        pass: false,
        message: () => 'Expected the function to throw an error.\n' + "But it didn't throw anything."
      };
    }

    const pass = (0, _predicate2.default)(error, type, message);
    if (pass) {
      return { pass: true, message: passMessage(error, new type(message)) };
    }

    return { pass: false, message: failMessage(error, new type(message)) };
  }
};