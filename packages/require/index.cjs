// @ts-check
"use strict";

const { dirname } = require("path");
const _resolve = require("resolve");

/**
 * @type {import('./index').resolve}
 */
function resolve(id, { base } = {}) {
  return new Promise((resolve, reject) => {
    const options = {};

    if (base) options.basedir = dirname(base);

    _resolve(id, options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

exports.resolve = resolve;

/**
 * @type {import('./index').requireModule}
 */
function requireModule(id) {
  return require(id);
}

exports.requireModule = requireModule;

/**
 * @type {import('./index').requireDefault}
 */
function requireDefault(id) {
  const mod = require(id);
  return mod.__esModule ? mod.default : mod;
}

exports.requireDefault = requireDefault;

/**
 * @type {import('./index').requireNamedExport}
 */
function requireNamedExport(id, name) {
  return require(id)[name];
}

exports.requireNamedExport = requireNamedExport;

/**
 * @type {import('./index').getModuleExtensions}
 */
function getModuleExtensions() {
  // eslint-disable-next-line node/no-deprecated-api
  const extensions = require.extensions;
  return Object.keys(extensions).map((ext) => ext.substring(1));
}

exports.getModuleExtensions = getModuleExtensions;
