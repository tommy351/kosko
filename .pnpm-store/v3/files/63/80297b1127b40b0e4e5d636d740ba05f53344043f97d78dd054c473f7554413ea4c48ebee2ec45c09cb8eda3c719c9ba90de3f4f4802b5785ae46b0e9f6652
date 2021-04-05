"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const smallest = ns => ns.reduce((acc, n) => acc < n ? acc : n);

exports.default = (firstInvocationCallOrder, secondInvocationCallOrder) => {
  if (firstInvocationCallOrder.length === 0) return true;
  if (secondInvocationCallOrder.length === 0) return false;

  const firstSmallest = smallest(firstInvocationCallOrder);
  const secondSmallest = smallest(secondInvocationCallOrder);

  return firstSmallest > secondSmallest;
};