'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = (object, values) => {
  const objectValues = Object.keys(object).map(k => object[k]);
  return objectValues.length === values.length && objectValues.every(objectValue => (0, _utils.contains)(values, objectValue));
};