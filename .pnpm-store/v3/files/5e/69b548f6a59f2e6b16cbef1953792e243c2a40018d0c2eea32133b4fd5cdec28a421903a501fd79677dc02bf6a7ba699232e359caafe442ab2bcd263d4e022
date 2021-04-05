'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = (object, values) => {
  const objectValues = Object.keys(object).map(k => object[k]);
  return values.every(value => (0, _utils.contains)(objectValues, value));
};