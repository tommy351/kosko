// @ts-check
"use strict";

const { isAbsolute } = require("node:path");
const { pathToFileURL } = require("node:url");
const _resolve = require("resolve");

/** @type {Promise<boolean> | undefined} */
let isESMSupportedCache;

/** @type {import('./index').isESMSupported} */
async function isESMSupported() {
  if (process.env.ESM_IMPORT_DISABLED) return false;

  if (!isESMSupportedCache) {
    isESMSupportedCache = (async () => {
      try {
        // eslint-disable-next-line node/no-missing-import, node/no-unpublished-import
        await import("data:text/javascript,");
        return true;
      } catch {
        return false;
      }
    })();
  }

  return isESMSupportedCache;
}

exports.isESMSupported = isESMSupported;

/** @type {import('./index').importPath} */
async function importPath(path) {
  if (await isESMSupported()) {
    const id = isAbsolute(path) ? pathToFileURL(path).toString() : path;

    try {
      return await import(id);
    } catch (err) {
      // TODO: Detect if file extension can be imported beforehand
      if (err.code !== "ERR_UNKNOWN_FILE_EXTENSION") {
        throw err;
      }
    }
  }

  const mod = require(path);
  return mod && mod.__esModule ? mod : { ...mod, default: mod };
}

exports.importPath = importPath;

/** @type {import('./index').requireDefault} */
function requireDefault(id) {
  const mod = require(id);
  return mod && mod.__esModule ? mod.default : mod;
}

exports.requireDefault = requireDefault;

/**
 * @param {string} id
 * @param {import('resolve').AsyncOpts | undefined} options
 * @returns {Promise<string | undefined>}
 */
function resolveAsync(id, options = {}) {
  return new Promise((resolve, reject) => {
    _resolve(id, options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/** @type {import('./index').resolve} */
function resolve(id, options = {}) {
  return resolveAsync(id, {
    basedir: options.baseDir,
    extensions: options.extensions
  });
}

exports.resolve = resolve;

/** @type {import('./index').resolveESM} */
function resolveESM(id, options = {}) {
  return resolveAsync(id, {
    basedir: options.baseDir,
    extensions: options.extensions,
    packageFilter(pkg) {
      return {
        ...pkg,
        main: pkg.module || pkg.main
      };
    }
  });
}

exports.resolveESM = resolveESM;

/** @type {import('./index').getRequireExtensions} */
function getRequireExtensions() {
  // eslint-disable-next-line node/no-deprecated-api
  return [".cjs", ".mjs", ...Object.keys(require.extensions)];
}

exports.getRequireExtensions = getRequireExtensions;
