'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jestGetType = require('jest-get-type');

var _jestGetType2 = _interopRequireDefault(_jestGetType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isValidDate = value => (0, _jestGetType2.default)(value) === 'date' && !isNaN(value) && !isNaN(value.getTime());

exports.default = isValidDate;