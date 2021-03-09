---
id: overview
title: Overview
---

## [Components](components.md)

A component is a collection of Kubernetes manifests including all resources needed for an application such as deployments, services, secrets, etc.

## [Environments](environments.md)

Environments are variables specific to different clusters. For example, you may have `dev` and `prod` environments for different clusters.

There are two types of variables:

- **Global Variables** - Shared across all components.
- **Component Variables** - Only used within a component.

## [Templates](templates.md)

A template helps you generate code easily so you don't have to build from scratch every time.

## Folder Structure

The following is a basic folder structure of a kosko directory.

```shell
.
├── components
├── environments
├── kosko.toml
└── templates
```

- `components` - Components folder.
- `environments` - Environments folder.
- `kosko.toml` - [Configuration](configuration.md) file.
- `templates` - Templates folder.

## Examples

- [Getting Started](https://github.com/tommy351/kosko/tree/master/examples/getting-started)
- [Environment](https://github.com/tommy351/kosko/tree/master/examples/environment)
- [Using TypeScript](https://github.com/tommy351/kosko/tree/master/examples/typescript)
- [Using Babel](https://github.com/tommy351/kosko/tree/master/examples/babel)
- [Run Programmatically](https://github.com/tommy351/kosko/tree/master/examples/run-programmatically)
- [Run Programmatically (ESM)](https://github.com/tommy351/kosko/tree/master/examples/run-programmatically-esm)
- [Create a Component with Template](https://github.com/tommy351/kosko/tree/master/examples/template-component)
- [Alternative Folder Structure](https://github.com/tommy351/kosko/tree/master/examples/alternative-folder-structure)
