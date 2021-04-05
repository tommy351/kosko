'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestMatcherUtils = require('jest-matcher-utils');

var _predicate = require('./predicate');

var _predicate2 = _interopRequireDefault(_predicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const passMessage = () => (0, _jestMatcherUtils.matcherHint)('.not.toReject', 'received', '') + '\n\n' + 'Expected promise to resolve, however it rejected.\n';

const failMessage = () => (0, _jestMatcherUtils.matcherHint)('.toReject', 'received', '') + '\n\n' + 'Expected promise to reject, however it resolved.\n';

exports.default = {
  toReject: (() => {
    var _ref = _asyncToGenerator(function* (promise) {
      const pass = yield (0, _predicate2.default)(promise);
      if (pass) {
        return { pass: true, message: passMessage };
      }
      return { pass: false, message: failMessage };
    });

    return function toReject(_x) {
      return _ref.apply(this, arguments);
    };
  })()
};