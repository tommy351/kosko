'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = (obj, entries) => {
  if (!obj.hasOwnProperty || entries.length != Object.keys(obj).length) {
    return false;
  }

  return entries.every(([key, value]) => obj.hasOwnProperty(key) && (0, _utils.equals)(obj[key], value));
};