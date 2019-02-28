# Overview

## [Components](components.md)

A component is a collection of Kubernetes manifests including all resources needed for an application such as deployments, services, secrets, etc.

More details:

- [Writing Components](components.md)
- [Migrating existing YAML](commands.md#migrate)

## [Environments](environments.md)

Environments are variables specific to different clusters. For example, you may have `dev` and `prod` environments for different clusters.

There are two types of variables:

- **Global Variables** - Shared across all components.
- **Component Variables** - Only used within a component.

## [Templates](templates.md)

A template helps you generate code easily so you don't have to build from scratch every time.

## Folder Structure

The following is a basic folder structure of a kosko directory.

```sh
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
