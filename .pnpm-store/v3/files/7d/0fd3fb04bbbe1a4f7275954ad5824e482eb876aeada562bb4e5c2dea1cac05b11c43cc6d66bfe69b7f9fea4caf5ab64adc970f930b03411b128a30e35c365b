"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domUtils = void 0;
const ExecutionEnvironment_1 = __importDefault(require("@docusaurus/ExecutionEnvironment"));
function getPropertyValue(name) {
    return window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(name);
}
function convertRemToPx(rem) {
    return (parseFloat(getPropertyValue('font-size')) *
        (typeof rem === 'string' ? parseFloat(rem) : rem));
}
function isInViewport(element) {
    const { top, left, bottom, right } = element.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return top >= 0 && right <= innerWidth && bottom <= innerHeight && left >= 0;
}
exports.domUtils = new Proxy({ getPropertyValue, convertRemToPx, isInViewport }, {
    get: (obj, prop) => {
        const origMethod = obj[prop];
        return (...args) => {
            if (!ExecutionEnvironment_1.default.canUseDOM) {
                return undefined;
            }
            return origMethod.apply(obj, args);
        };
    },
});
