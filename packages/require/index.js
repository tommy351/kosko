// @ts-check
"use strict";

const { isAbsolute } = require("path");
const { pathToFileURL } = require("url");
const _resolve = require("resolve");

/** @type {Promise<boolean> | undefined} */
let isESMSupportedCache;

/**
 * @returns {Promise<boolean>}
 */
async function isESMSupported() {
  if (process.env.ESM_IMPORT_DISABLED) return false;

  if (!isESMSupportedCache) {
    isESMSupportedCache = (async () => {
      try {
        // eslint-disable-next-line node/no-missing-import
        await import("data:text/javascript,");
        return true;
      } catch {
        return false;
      }
    })();
  }

  return isESMSupportedCache;
}

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

/** @type {import('./index').resolve} */
function resolve(id, options = {}) {
  return new Promise((resolve, reject) => {
    _resolve(id, { basedir: options.baseDir }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

exports.resolve = resolve;

/** @type {import('./index').getRequireExtensions} */
function getRequireExtensions() {
  // eslint-disable-next-line node/no-deprecated-api
  return Object.keys(require.extensions);
}

exports.getRequireExtensions = getRequireExtensions;
