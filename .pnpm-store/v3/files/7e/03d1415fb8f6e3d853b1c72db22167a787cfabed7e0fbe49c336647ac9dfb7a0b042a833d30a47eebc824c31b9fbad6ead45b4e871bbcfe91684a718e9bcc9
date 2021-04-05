"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (error, type, message) => {
  if (message instanceof RegExp) {
    return error && error instanceof type && message.test(error.message);
  }
  return error && error instanceof type && error.message === message;
};