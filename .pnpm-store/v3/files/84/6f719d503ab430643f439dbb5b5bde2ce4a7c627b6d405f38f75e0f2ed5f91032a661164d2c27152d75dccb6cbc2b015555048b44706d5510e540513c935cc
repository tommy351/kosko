"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Seo;

var _react = _interopRequireDefault(require("react"));

var _Head = _interopRequireDefault(require("@docusaurus/Head"));

var _useBaseUrl = _interopRequireDefault(require("@docusaurus/useBaseUrl"));

var _themeCommon = require("@docusaurus/theme-common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function Seo({
  title,
  description,
  keywords,
  image
}) {
  const metaTitle = (0, _themeCommon.useTitleFormatter)(title);
  const metaImageUrl = (0, _useBaseUrl.default)(image, {
    absolute: true
  });
  return <_Head.default>
      {title && <title>{metaTitle}</title>}
      {title && <meta property="og:title" content={metaTitle} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}

      {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(',') : keywords} />}

      {image && <meta property="og:image" content={metaImageUrl} />}
      {image && <meta name="twitter:image" content={metaImageUrl} />}
      {image && <meta name="twitter:card" content="summary_large_image" />}
    </_Head.default>;
}