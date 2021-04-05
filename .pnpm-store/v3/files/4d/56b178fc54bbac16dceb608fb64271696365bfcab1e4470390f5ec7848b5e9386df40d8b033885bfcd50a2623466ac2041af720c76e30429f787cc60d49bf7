"use strict";
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function areIntlLocalesSupported(locales, constructorsToCheck) {
    if (typeof Intl === 'undefined') {
        return false;
    }
    if (!locales) {
        throw new Error('locales must be supplied.');
    }
    if (!Array.isArray(locales)) {
        locales = [locales];
    }
    var intlConstructors = constructorsToCheck || [
        Intl.DateTimeFormat,
        Intl.NumberFormat,
        Intl.PluralRules,
    ];
    intlConstructors = intlConstructors.filter(Boolean);
    if (intlConstructors.length === 0 ||
        (constructorsToCheck &&
            intlConstructors.length !== constructorsToCheck.length)) {
        return false;
    }
    return intlConstructors.every(function (intlConstructor) {
        return intlConstructor.supportedLocalesOf(locales).length === locales.length;
    });
}
exports.default = areIntlLocalesSupported;
//# sourceMappingURL=index.js.map