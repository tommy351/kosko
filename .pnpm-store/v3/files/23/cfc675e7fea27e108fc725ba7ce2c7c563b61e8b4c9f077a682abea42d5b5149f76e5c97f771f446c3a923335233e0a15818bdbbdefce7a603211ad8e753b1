'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passMessage = () => (0, _jestMatcherUtils.matcherHint)('.not.toBeFrozen', 'received', '') + '\n\n' + 'Expected object to not be frozen';

const failMessage = () => (0, _jestMatcherUtils.matcherHint)('.toBeFrozen', 'received', '') + '\n\n' + 'Expected object to be frozen';

exports.default = {
  toBeFrozen: expected => {
    const pass = (0, _predicate2.default)(expected);
    if (pass) {
      return { pass: true, message: passMessage };
    }

    return { pass: false, message: failMessage };
  }
};