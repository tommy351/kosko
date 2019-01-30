# kosko

[![](https://img.shields.io/npm/v/kosko.svg)](https://www.npmjs.com/package/kosko) [![CircleCI](https://circleci.com/gh/tommy351/kosko/tree/master.svg?style=svg)](https://circleci.com/gh/tommy351/kosko/tree/master) [![Build status](https://ci.appveyor.com/api/projects/status/db26i79eyxp8tjxj/branch/master?svg=true)](https://ci.appveyor.com/project/tommy351/kosko/branch/master) [![codecov](https://codecov.io/gh/tommy351/kosko/branch/master/graph/badge.svg)](https://codecov.io/gh/tommy351/kosko)

Write Kubernetes manifests in JavaScript.

kosko is inspired by [ksonnet] but use JavaScript instead of [jsonnet] so you don't have to learn another language. Unlike [ksonnet], kosko neither touchs Kubernetes clusters nor supports [Helm]. It's focus on building and organizing Kubernetes manifests in JavaScript.

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
├── kosko.toml
├── package.json
└── templates
```

### Create a Component

Create a new component with `@kosko/template-deployed-service` template.

```sh
npx @kosko/template-deployed-service --name nginx --image nginx
```

This template creates a new file named `nginx.js` in `components` folder.

### Generate Kubernetes Manifests

Run `kosko generate` to print Kubernetes manifests in the console.

```sh
kosko generate
```

Pipe the output to kubectl to apply to a cluster.

```sh
kosko generate | kubectl apply -f -
```

## Documentation

- [Component](packages/generate/README.md)
- [Environment](packages/env/README.md)
- [Template](packages/template/README.md)
- [Configuration](packages/config/README.md)
- [Commands](packages/cli/README.md)

## Examples

- [Getting Started](examples/getting-started)
- [Environment](examples/environment)
- [Using TypeScript](examples/typescript)
- [Using Babel](examples/babel)
- [Run Programmatically](examples/run-programmatically)
- [Create a Component with Template](examples/template-component)

## Packages

### Core

- [@kosko/cli](packages/cli) - CLI.
- [@kosko/config](packages/config) - Load kosko configuration.
- [@kosko/env](packages/env) - Manage environemnts in kosko.
- [@kosko/generate](packages/generate) - Find and print components.
- [@kosko/migrate](packages/migrate) - Migrate Kubernetes YAML into kosko components.
- [@kosko/require](packages/require) - Import and resolve modules.
- [@kosko/template](packages/template) - Utilities for templates.

### Templates

- [@kosko/template-deployed-service](packages/template-deployed-service) - Create a new component including a deployment and a service.
- [@kosko/template-environment](packages/template-environment) - Create a new environment.

### Related

- [kubernetes-models-ts](https://github.com/tommy351/kubernetes-models-ts/) - Kubernetes models in TypeScript.

## License

MIT

[ksonnet]: https://ksonnet.io/
[jsonnet]: https://jsonnet.org/
[helm]: https://helm.sh/
