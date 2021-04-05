'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

const isEmptyIterable = value => {
  if (typeof value[Symbol.iterator] !== 'function') {
    return false;
  }
  const firstIteration = value[Symbol.iterator]().next();
  return firstIteration.done;
};

exports.default = value => (0, _utils.equals)({}, value) || isEmptyIterable(value);