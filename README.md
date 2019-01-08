# kosko

[![](https://img.shields.io/npm/v/kosko.svg)](https://www.npmjs.com/package/kosko) [![Build Status](https://travis-ci.org/tommy351/kosko.svg?branch=master)](https://travis-ci.org/tommy351/kosko) [![Build status](https://ci.appveyor.com/api/projects/status/db26i79eyxp8tjxj/branch/master?svg=true)](https://ci.appveyor.com/project/tommy351/kosko/branch/master) [![codecov](https://codecov.io/gh/tommy351/kosko/branch/master/graph/badge.svg)](https://codecov.io/gh/tommy351/kosko)

Write Kubernetes manifests in JavaScript.

kosko is inspired by [ksonnet] but use JavaScript instead of [jsonnet] so it's much easier to learn and use. Unlike [ksonnet], kosko doesn't touch Kubernetes clusters and doesn't support [Helm] neither. It's focus on building and organizing Kubernetes manifests in JavaScript.

## Installation

Install kosko globally with npm.

```sh
npm install -g kosko
```

## Getting Started

### Setup

First, run `kosko init` to set up a new kosko directory and `npm install` to install dependencies.

```sh
kosko init example
cd example
npm install
```

`kosko init` generates the following directories and files in the specified path.

```sh
├── components
├── environments
├── package.json
└── templates
```

### Create a Environment

Install `@kosko/template-environment` and run `kosko new` to create a new environment.

```sh
npx @kosko/template-environment --name dev
```

This template creates a new folder named `dev` in `environments` folder with an `index.js` in the folder. You can specify global variables in `index.js` and component variables in other JavaScript files.

```sh
environments
└── dev
    ├── foo.js   # Component variables
    └── index.js # Global variables
```

### Create a Component

Install `@kosko/template-deployed-service` and run `kosko new` to create a new component.

```sh
npx @kosko/template-deployed-service --name nginx --image nginx
```

This template creates a new file named `nginx.js` in `components` folder.

### Generate Kubernetes Manifests

Run `kosko generate` to print Kubernetes manifests in the console.

```sh
kosko generate --env dev
```

Pipe the output to kubectl to apply to a cluster.

```sh
kosko generate --env dev | kubectl apply -f -
```

### More Examples

See [examples](examples) folder for more examples.

## Packages

### Core

- [@kosko/cli](packages/cli) - CLI.
- [@kosko/env](packages/env) - Manage environemnts in kosko.
- [@kosko/generate](packages/generate) - Find and print components.
- [@kosko/require](packages/require) - Import and resolve modules.
- [@kosko/template](packages/template) - Utilities for templates.

### Templates

- [@kosko/template-deployed-service](packages/template-deployed-service) - Create a new component including a deployment and a service.
- [@kosko/template-environment](packages/template-environment) - Create a new environment.

## License

MIT

[ksonnet]: https://ksonnet.io/
[jsonnet]: https://jsonnet.org/
[helm]: https://helm.sh/
