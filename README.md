# kosko

[![](https://img.shields.io/npm/v/kosko.svg)](https://www.npmjs.com/package/kosko) ![Test](https://github.com/tommy351/kosko/workflows/Test/badge.svg) [![codecov](https://codecov.io/gh/tommy351/kosko/branch/master/graph/badge.svg)](https://codecov.io/gh/tommy351/kosko) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![Netlify Status](https://api.netlify.com/api/v1/badges/88dd3339-bd80-49bd-88cb-8081c312ae12/deploy-status)](https://app.netlify.com/sites/kosko/deploys)

Write Kubernetes manifests in JavaScript.

kosko is inspired by [ksonnet] but use JavaScript instead of [jsonnet]. Unlike [ksonnet], kosko neither touchs Kubernetes clusters nor supports [Helm]. It's focus on building and organizing Kubernetes manifests in JavaScript.

## Features

- Use JavaScript or any languages compiled to JavaScript. (e.g. [TypeScript])
- Manage multiple environments.
- Validate against Kubernetes OpenAPI definitions.
- Reuse variables and functions across components.

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

Learn more on [the official site](https://kosko.dev).

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

[ksonnet]: https://ksonnet.io/
[jsonnet]: https://jsonnet.org/
[helm]: https://helm.sh/
[typescript]: https://www.typescriptlang.org/
