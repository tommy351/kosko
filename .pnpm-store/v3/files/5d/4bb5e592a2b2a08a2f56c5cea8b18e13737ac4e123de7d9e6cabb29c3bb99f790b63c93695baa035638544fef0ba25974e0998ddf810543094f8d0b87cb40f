# tsc-multi

[![](https://img.shields.io/npm/v/tsc-multi.svg)](https://www.npmjs.com/package/tsc-multi) ![Test](https://github.com/tommy351/tsc-multi/workflows/Test/badge.svg)

Compile multiple TypeScript projects into multiple targets.

## Installation

```sh
npm install tsc-multi --save-dev
```

## Usage

Create a `tsc-multi.json` in the folder.

```json
{
  "targets": [
    { "extname": ".cjs", "module": "commonjs" },
    { "extname": ".mjs", "module": "esnext" }
  ],
  "projects": ["packages/*/tsconfig.json"]
}
```

Build TypeScript files.

```sh
tsc-multi
```

Watch changes and rebuild TypeScript files.

```sh
tsc-multi --watch
```

Delete built files.

```sh
tsc-multi --clean
```

## Configuration

### `targets`

Build targets. All options except `extname` will override `compilerOptions` in `tsconfig.json`. At least one target is required.

```js
{
  // Rename the extension of output files
  extname: ".js",
  // Compiler options
  module: "esnext",
  target: "es2018",
}
```

### `projects`

Path to TypeScript projects. It can be either a folder which contains `tsconfig.json`, or the path to `tsconfig.json`. This option can be set in either the config file or CLI.

```js
[
  // CWD
  ".",
  // Folder
  "pkg-a",
  // tsconfig.json path
  "tsconfig.custom.json",
  // Glob
  "packages/*/tsconfig.json",
];
```

### `compiler`

Specify a custom TypeScript compiler (e.g. [ttypescript](https://github.com/cevek/ttypescript)).

## CLI Options

### `--watch`

Watch input files and rebuild when they are changed.

### `--clean`

Delete built files. Only available when `compilerOptions.rootDir` is specified in `tsconfig.json`.

### `--verbose`

Print debug logs.

### `--cwd`

Specify the current working directory (CWD).

### `--config`

Specify the path of the config file. The path can be either a relative path or an absolute path. Default to `$CWD/tsc-multi.json`.

### `--compiler`

Specify a custom TypeScript compiler.

## License

MIT
