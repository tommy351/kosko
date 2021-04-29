// @ts-check
"use strict";

const ts = require("typescript");
const isBuiltinModule = require("is-builtin-module");
const pkgUp = require("pkg-up");
const { dirname, join } = require("path");

const ROOT_DIR = join(__dirname, "../..");

/** @type {Record<string, string>} */
const pkgJsonPathMap = {};

/** @type {Record<string, any>} */
const pkgJsonMap = {};

/** @type {Record<string, string>} */
const workspaceVersionMap = {};

/**
 * @param {string} specifier
 * @returns {boolean}
 */
function isBareSpecifier(specifier) {
  return /^[a-z@]/.test(specifier);
}

/**
 * @param {string} path
 * @returns {string}
 */
function getPkgJsonPath(path) {
  if (!pkgJsonPathMap[path]) {
    const cwd = dirname(path);
    pkgJsonPathMap[path] = pkgUp.sync({ cwd });
  }

  return pkgJsonPathMap[path];
}

/**
 * @param {string} path
 * @returns {any}
 */
function readPkgJson(path) {
  if (!pkgJsonMap[path]) {
    pkgJsonMap[path] = require(path);
  }

  return pkgJsonMap[path];
}

/**
 * @param {string} specifier
 * @returns {string}
 */
function getWorkspaceVersion(specifier) {
  if (!workspaceVersionMap[specifier]) {
    const [, name] = specifier.split("/");
    const pkg = readPkgJson(join(ROOT_DIR, "packages", name, "package.json"));
    return pkg.version;
  }

  return workspaceVersionMap[specifier];
}

/**
 * @param {any} pkg
 * @param {string} specifier
 * @returns {string}
 */
function getDependencyVersion(pkg, specifier) {
  const version =
    (pkg.dependencies || {})[specifier] ||
    (pkg.devDependencies || {})[specifier];

  if (!version) {
    return "latest";
  }

  if (version.startsWith("workspace:")) {
    return getWorkspaceVersion(specifier);
  }

  return version;
}

/**
 * @param {string} sourcePath
 * @param {string} specifier
 * @returns {string}
 */
function rewriteModuleSpecifier(sourcePath, specifier) {
  if (isBuiltinModule(specifier)) {
    return `https://deno.land/std@0.95.0/node/${specifier.split("/")[0]}.ts`;
  }

  const pkg = readPkgJson(getPkgJsonPath(sourcePath));
  const version = getDependencyVersion(pkg, specifier);

  return `https://cdn.skypack.dev/${specifier}@${version}?dts`;
}

/** @returns {ts.TransformerFactory<ts.SourceFile>} */
module.exports = () => {
  return (ctx) => {
    /** @type {ts.Visitor} */
    const visitor = (node) => {
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        isBareSpecifier(node.moduleSpecifier.text)
      ) {
        return ctx.factory.createImportDeclaration(
          node.decorators,
          node.modifiers,
          node.importClause,
          ctx.factory.createStringLiteral(
            rewriteModuleSpecifier(
              node.getSourceFile().fileName,
              node.moduleSpecifier.text
            )
          )
        );
      }

      return ts.visitEachChild(node, visitor, ctx);
    };

    return (sourceFile) => {
      return ts.visitNode(sourceFile, visitor);
    };
  };
};
