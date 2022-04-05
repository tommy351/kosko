"use strict";

const babel = require("@babel/core");
const syntaxTs = require("@babel/plugin-syntax-typescript");
const traverse = require("@babel/traverse").default;
const generate = require("./generate");

function tsToEsm(input) {
  const ast = babel.parseSync(input, {
    filename: "file.ts",
    sourceType: "module",
    plugins: [syntaxTs]
  });

  traverse(ast, {
    TSInterfaceDeclaration(path) {
      path.remove();
    },
    TSTypeAliasDeclaration(path) {
      path.remove();
    },
    TSTypeAnnotation(path) {
      path.remove();
    },
    TSDeclareFunction(path) {
      path.remove();
    },
    TSDeclareMethod(path) {
      path.remove();
    },
    VariableDeclaration(path) {
      if (path.node.declare) {
        path.remove();
      }
    },
    TSIndexSignature(path) {
      path.remove();
    },
    ClassDeclaration(path) {
      if (path.node.declare) {
        path.remove();
      }
    },
    Class(path) {
      const { node } = path;

      if (node.typeParameters) node.typeParameters = null;
      if (node.superTypeParameters) node.superTypeParameters = null;
      if (node.implements) node.implements = null;
      if (node.abstract) node.abstract = null;
    },
    ClassProperty(path) {
      const { node } = path;

      if (node.accessibility) node.accessibility = null;
      if (node.abstract) node.abstract = null;
      if (node.readonly) node.readonly = null;
      if (node.optional) node.optional = null;
      if (node.typeAnnotation) node.typeAnnotation = null;
      if (node.definite) node.definite = null;
      if (node.declare) node.declare = null;
      if (node.override) node.override = null;
    },
    ClassMethod(path) {
      const { node } = path;

      if (node.accessibility) node.accessibility = null;
      if (node.abstract) node.abstract = null;
      if (node.optional) node.optional = null;
      if (node.override) node.override = null;
    },
    Function(path) {
      const { node } = path;

      if (node.typeParameters) node.typeParameters = null;
      if (node.returnType) node.returnType = null;

      const params = node.params;

      if (
        params.length > 0 &&
        babel.types.isIdentifier(params[0], { name: "this" })
      ) {
        params.shift();
      }
    },
    TSTypeAssertion(path) {
      path.replaceWith(path.node.expression);
    },
    TSAsExpression(path) {
      let { node } = path;
      do {
        node = node.expression;
      } while (babel.types.isTSAsExpression(node));
      path.replaceWith(node);
    },
    TSNonNullExpression(path) {
      path.replaceWith(path.node.expression);
    },
    TSParameterProperty(path) {
      const { node } = path;

      if (node.accessibility) node.accessibility = null;
      if (node.readonly) node.readonly = null;
      if (node.override) node.override = null;
    },
    CallExpression(path) {
      path.node.typeParameters = null;
    },
    OptionalCallExpression(path) {
      path.node.typeParameters = null;
    },
    NewExpression(path) {
      path.node.typeParameters = null;
    },
    JSXOpeningElement(path) {
      path.node.typeParameters = null;
    },
    TaggedTemplateExpression(path) {
      path.node.typeParameters = null;
    },
    Identifier(path) {
      const { node } = path;

      if (node.typeAnnotation) node.typeAnnotation = null;
      if (node.optional) node.optional = null;
    },
    RestElement(path) {
      const { node } = path;

      if (node.typeAnnotation) node.typeAnnotation = null;
    },
    Pattern(path) {
      const { node } = path;

      if (node.typeAnnotation) node.typeAnnotation = null;
    }
  });

  return generate(ast, input);
}

module.exports = tsToEsm;
