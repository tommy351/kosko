"use strict";

function getRequireExtensions() {
  // eslint-disable-next-line node/no-deprecated-api
  return Object.keys(require.extensions);
}

module.exports = getRequireExtensions;
