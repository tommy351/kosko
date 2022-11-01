---
title: Configuration
---

## Global Configs

Global configs are always applied when running [`kosko generate`][kosko-generate] command.

### `bail`

:::info
Available since v3.0.0.
:::

Default: `false`

Stop immediately when an error occurred.

### `baseEnvironment`

Specify the base environment. You could define default or common variables in the base environment.

This option can be used with or without [`--env, -e`][kosko-generate-env] option. When [`--env, -e`][kosko-generate-env] option is set, variables in the base environment will be merged with the specified environment.

### `components`

Components to generate. It can be either a component's name or a [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>).

If this value is not provided in `kosko.toml`, then you must provides components when running [`kosko generate`][kosko-generate] command.

#### Examples {#global-components-example}

```toml
# Generate all components in components folder
components = ["*"]

# Generate components with the specified names
components = ["foo", "bar"]

# Generate components matched to the glob patterns
components = ["foo_*", "bar_*"]

# Ignore components
components = ["!foo", "!bar"]
```

### `extensions`

Extension names of components. It's unnecessary to manually set this option. It can be detected automatically via [`require.extensions`](https://nodejs.org/api/modules.html#modules_require_extensions).

#### Examples {#global-extensions-example}

```toml
extensions = ["js", "json"]
```

### `loaders`

:::info
Available since v3.0.0.
:::

Use [module loaders](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#loaders). This option only works when ECMAScript modules (ESM) is enabled.

#### Examples {#global-loaders-examples}

```toml
# Using TypeScript
loaders = ["ts-node/esm"]
```

### `require`

Require external modules.

#### Examples {#global-require-examples}

```toml
# Using TypeScript
require = ["ts-node/register"]
```

## Environment Configs

Environment configs are applied when running [`kosko generate`][kosko-generate] with [`--env, -e`][kosko-generate-env] option. Environment configs are merged with global configs. Only `components`, `loaders` and `require` can be specified in environment configs.

#### Examples {#environment-configs-examples}

```toml
# Applied when env = "dev"
[environments.dev]
components = ["*_dev"]

# Applied when env = "prod"
[environments.prod]
components = ["*_prod"]
```

## Paths

### Tokens

- `#{environment}` - Environment name
- `#{component}` - Component name (Only available in `paths.environment.component`)

### `paths.environment.global`

Specify path to global environment files.

#### Default {#paths-environment-global-default}

```
environments/#{environment}
```

### `paths.environment.component`

Specify path to component environment files.

#### Default {#paths-environment-component-default}

```
environments/#{environment}/#{component}
```

[kosko-generate]: cli/generate.md
[kosko-generate-env]: cli/generate.md#--env--e
