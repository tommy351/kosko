---
title: Plugins
available_since:
  kosko: 4.0.0
---

You can extend Kosko with plugins. Plugins can transform or validate manifests.

## Enabling

You can enable plugins by adding them to the `plugins` array in the config file. The name could be a package name or a path to a local file.

```toml name="kosko.toml"
[[plugins]]
name = "example"
```

Plugins are executed in the order they are defined in the config file. For example, in the following configuration, plugin `a` will be executed before plugin `b`.

```toml name="kosko.toml"
[[plugins]]
name = "a"

[[plugins]]
name = "b"
```

Some plugins may require additional configuration. You can add a `config` field to the plugin definition to provide the configuration.

```toml name="kosko.toml"
[[plugins]]
name = "example"
config.key = "value"
```

## Environments

Each environment can have its own plugins.

```toml name="kosko.toml"
[[environments.dev.plugins]]
name = "example"
```

If a plugin is defined in both the global and the environment section, it will be executed twice. In the following example, the `example` plugin will be executed twice in the `dev` environment.

```toml name="kosko.toml"
[[plugins]]
name = "example"

[[environments.dev.plugins]]
name = "example"
```
