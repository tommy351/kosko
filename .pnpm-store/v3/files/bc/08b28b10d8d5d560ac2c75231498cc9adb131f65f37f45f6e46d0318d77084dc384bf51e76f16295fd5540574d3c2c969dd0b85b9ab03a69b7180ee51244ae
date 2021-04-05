'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = (object, entries) => {
  const objectEntries = Object.keys(object).map(k => [k, object[k]]);
  return entries.some(entry => (0, _utils.contains)(objectEntries, entry));
};