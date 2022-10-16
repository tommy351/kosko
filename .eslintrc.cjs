"use strict";

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "unicorn"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:node/recommended"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "jest/consistent-test-it": [
      "error",
      {
        fn: "test",
        withinDescribe: "test"
      }
    ],
    "node/no-unsupported-features/es-syntax": [
      "error",
      {
        ignores: ["modules", "dynamicImport"]
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "util",
            importNames: ["promisify"],
            message: "Not exported by rollup-plugin-node-polyfills."
          }
        ]
      }
    ],
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-export-from": "error"
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.eslint.json",
      "./internal/*/tsconfig.json",
      "./packages/*/tsconfig.json",
      "./website/tsconfig.eslint.json"
    ]
  },
  settings: {
    node: {
      tryExtensions: [
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".cjs",
        ".mjs",
        ".json",
        ".node"
      ]
    }
  },
  overrides: [
    {
      files: ["*.{js,jsx,cjs,mjs}"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off"
      }
    },
    {
      files: ["internal/**/*.ts", "packages/**/*.ts", "website/**/*.{ts,tsx}"],
      excludedFiles: ["packages/cli/templates/**/*"],
      extends: ["plugin:@typescript-eslint/recommended-requiring-type-checking"]
    },
    {
      files: ["**/__tests__/**/*.ts"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/restrict-template-expressions": "off"
      }
    },
    {
      files: ["packages/**/*.ts"],
      excludedFiles: ["**/__tests__/**/*.ts"],
      rules: {
        "no-restricted-globals": [
          "error",
          {
            name: "require",
            message: "Use @kosko/require instead."
          }
        ]
      }
    },
    {
      files: ["packages/cli/templates/**/*"],
      rules: {
        "node/no-extraneous-require": "off",
        "node/no-extraneous-import": "off",
        "node/no-unpublished-require": "off",
        "node/no-unpublished-import": "off"
      }
    },
    {
      files: ["integration/browser/**/*", "packages/*/integration/**/*"],
      rules: {
        "node/no-unpublished-require": "off",
        "node/no-unpublished-import": "off"
      },
      settings: {
        node: {
          allowModules: [
            "@kosko/env",
            "@kosko/generate",
            "@kosko/template",
            "@kosko/yaml"
          ]
        }
      }
    }
  ]
};
