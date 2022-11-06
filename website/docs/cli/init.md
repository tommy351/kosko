---
title: kosko init
---

Create a new Kosko project.

```shell
kosko init [path]
```

## Positionals

### `path`

Path to initialize. Default to the current directory.

## Options

### `--esm`

Generate ECMAScript module (ESM) files.

### `--force, -f`

Overwrite existing files.

### `--install`

Install dependencies automatically.

### `--package-manager, --pm`

Package manager (npm, yarn, pnpm). If this option is not specified, Kosko will detect package manager based on lock files.

### `--typescript, --ts`

Generate TypeScript files.
