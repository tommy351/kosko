# Kosko

[![](https://img.shields.io/npm/v/kosko.svg)](https://www.npmjs.com/package/kosko) ![Test](https://github.com/tommy351/kosko/workflows/Test/badge.svg) [![codecov](https://codecov.io/gh/tommy351/kosko/branch/master/graph/badge.svg)](https://codecov.io/gh/tommy351/kosko) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)

Organize Kubernetes manifests in JavaScript.

## Features

- Use JavaScript or any languages compiled to JavaScript. (e.g. [TypeScript])
- Manage multiple environments.
- Validate against Kubernetes OpenAPI definitions.
- Reuse variables and functions across components.

## Documentation

Learn more on [the official site](https://kosko.dev).

## Packages

### Core

- [@kosko/cli](packages/cli) - CLI.
- [@kosko/config](packages/config) - Load kosko configuration.
- [@kosko/env](packages/env) - Manage environemnts in Kosko.
- [@kosko/generate](packages/generate) - Find and print components.
- [@kosko/helm](packages/helm) - Load Helm charts in Kosko.
- [@kosko/log](packages/log) - Logging library for Kosko.
- [@kosko/migrate](packages/migrate) - Migrate Kubernetes YAML into Kosko components.
- [@kosko/require](packages/require) - Import and resolve modules.
- [@kosko/template](packages/template) - Utilities for templates.
- [@kosko/yaml](packages/yaml) - Load Kubernetes YAML files in Kosko.

### Templates

- [@kosko/template-deployed-service](packages/template-deployed-service) - Create a new component including a deployment and a service.
- [@kosko/template-environment](packages/template-environment) - Create a new environment.

### Related

- [kubernetes-models-ts](https://github.com/tommy351/kubernetes-models-ts/) - Kubernetes models in TypeScript.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

[typescript]: https://www.typescriptlang.org/
