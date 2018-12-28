# kosko

[![Build Status](https://travis-ci.org/tommy351/kosko.svg?branch=master)](https://travis-ci.org/tommy351/kosko)

Write Kubernetes resources in JavaScript. The structure is heavily inspired by [ksonnet](https://ksonnet.io/).

## Install

```sh
npm install -g @kosko/cli
```

## Getting Started

Use `kosko init` to initialize a basic folder structure for kosko.

```sh
kosko init example
npm install
```

```
├── components
├── environments
│   └── index.js
├── node_modules
└── package.json
```

Create a new environment with `kosko new` command and `@kosko/template-environment` template.

```sh
npm install @kosko/template-environment
kosko new @kosko/template-environment --name dev
```

See [examples](examples) folder for more examples.

## Commands

### init

### generate

### new

## License

MIT
