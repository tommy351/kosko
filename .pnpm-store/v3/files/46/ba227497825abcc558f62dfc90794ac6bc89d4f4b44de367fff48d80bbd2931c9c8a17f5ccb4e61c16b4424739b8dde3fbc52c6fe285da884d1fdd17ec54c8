'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = (firstInvocationCallOrder, secondInvocationCallOrder) => () => (0, _jestMatcherUtils.matcherHint)('.not.toHaveBeenCalledAfter') + '\n\n' + 'Expected first mock to not have been called after, invocationCallOrder:\n' + `  ${(0, _jestMatcherUtils.printExpected)(firstInvocationCallOrder)}\n` + 'Received second mock with invocationCallOrder:\n' + `  ${(0, _jestMatcherUtils.printReceived)(secondInvocationCallOrder)}`;

const failMessage = (firstInvocationCallOrder, secondInvocationCallOrder) => () => (0, _jestMatcherUtils.matcherHint)('.toHaveBeenCalledAfter') + '\n\n' + 'Expected first mock to have been called after, invocationCallOrder:\n' + `  ${(0, _jestMatcherUtils.printExpected)(firstInvocationCallOrder)}\n` + 'Received second mock with invocationCallOrder:\n' + `  ${(0, _jestMatcherUtils.printReceived)(secondInvocationCallOrder)}`;

exports.default = {
  toHaveBeenCalledAfter: (firstMock, secondMock) => {
    const firstInvocationCallOrder = firstMock.mock.invocationCallOrder;
    const secondInvocationCallOrder = secondMock.mock.invocationCallOrder;
    const pass = (0, _predicate2.default)(firstInvocationCallOrder, secondInvocationCallOrder);
    if (pass) {
      return { pass: true, message: passMessage(firstInvocationCallOrder, secondInvocationCallOrder) };
    }

    return { pass: false, message: failMessage(firstInvocationCallOrder, secondInvocationCallOrder) };
  }
};