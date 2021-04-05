'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

const filterMatches = (first, second) => second.reduce((remaining, secondValue) => {
  if (remaining === null) return remaining;

  const index = remaining.findIndex(firstValue => (0, _utils.equals)(secondValue, firstValue));

  if (index === -1) {
    return null;
  }

  return remaining.slice(0, index).concat(remaining.slice(index + 1));
}, first);

exports.default = (first, second) => {
  if (!Array.isArray(first) || !Array.isArray(second) || first.length !== second.length) {
    return false;
  }

  const remaining = filterMatches(first, second);

  return !!remaining && remaining.length === 0;
};