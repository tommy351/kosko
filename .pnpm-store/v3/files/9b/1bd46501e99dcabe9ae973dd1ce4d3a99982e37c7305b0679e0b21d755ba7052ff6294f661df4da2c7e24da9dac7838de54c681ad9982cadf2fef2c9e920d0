"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LastUpdated;

var _react = _interopRequireDefault(require("react"));

var _stylesModule = _interopRequireDefault(require("./styles.module.css"));

var _Translate = _interopRequireDefault(require("@docusaurus/Translate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function LastUpdatedAtDate({
  lastUpdatedAt,
  formattedLastUpdatedAt
}) {
  return <_Translate.default id="theme.lastUpdated.atDate" description="The words used to describe on which date a page has been last updated" values={{
    date: <time dateTime={new Date(lastUpdatedAt * 1000).toISOString()} className={_stylesModule.default.lastUpdatedDate}>
            {formattedLastUpdatedAt}
          </time>
  }}>
      {' on {date}'}
    </_Translate.default>;
}

function LastUpdatedByUser({
  lastUpdatedBy
}) {
  return <_Translate.default id="theme.lastUpdated.byUser" description="The words used to describe by who the page has been last updated" values={{
    user: <strong>{lastUpdatedBy}</strong>
  }}>
      {' by {user}'}
    </_Translate.default>;
}

function LastUpdated({
  lastUpdatedAt,
  formattedLastUpdatedAt,
  lastUpdatedBy
}) {
  return <div className="col text--right">
      <em>
        <small>
          <_Translate.default id="theme.lastUpdated.lastUpdatedAtBy" description="The sentence used to display when a page has been last updated, and by who" values={{
          atDate: lastUpdatedAt && formattedLastUpdatedAt ? <LastUpdatedAtDate lastUpdatedAt={lastUpdatedAt} formattedLastUpdatedAt={formattedLastUpdatedAt} /> : '',
          byUser: lastUpdatedBy ? <LastUpdatedByUser lastUpdatedBy={lastUpdatedBy} /> : ''
        }}>
            {'Last updated{atDate}{byUser}'}
          </_Translate.default>
          {process.env.NODE_ENV === 'development' && <div>
              <small> (Simulated during dev for better perf)</small>
            </div>}
        </small>
      </em>
    </div>;
}