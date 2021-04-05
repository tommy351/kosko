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
exports.useAlternatePageUtils = void 0;
const useDocusaurusContext_1 = __importDefault(require("@docusaurus/useDocusaurusContext"));
const router_1 = require("@docusaurus/router");
// Permits to obtain the url of the current page in another locale
// Useful to generate hreflang meta headers etc...
// See https://developers.google.com/search/docs/advanced/crawling/localized-versions
function useAlternatePageUtils() {
    const { siteConfig: { baseUrl, url }, i18n: { defaultLocale, currentLocale }, } = useDocusaurusContext_1.default();
    const { pathname } = router_1.useLocation();
    const baseUrlUnlocalized = currentLocale === defaultLocale
        ? baseUrl
        : baseUrl.replace(`/${currentLocale}/`, '/');
    const pathnameSuffix = pathname.replace(baseUrl, '');
    function getLocalizedBaseUrl(locale) {
        return locale === defaultLocale
            ? `${baseUrlUnlocalized}`
            : `${baseUrlUnlocalized}${locale}/`;
    }
    // TODO support correct alternate url when localized site is deployed on another domain
    function createUrl({ locale, fullyQualified, }) {
        return `${fullyQualified ? url : ''}${getLocalizedBaseUrl(locale)}${pathnameSuffix}`;
    }
    return { createUrl };
}
exports.useAlternatePageUtils = useAlternatePageUtils;
