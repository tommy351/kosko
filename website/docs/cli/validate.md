---
title: kosko validate
---

Validate components.

This command is almost identical to [`kosko generate`](generate.md) command, but does not print Kubernetes manifests to terminal. You can see more details and examples there.

```shell
kosko validate [components..]
```

## Positionals

### `components`

Components to generate. It can be either a component's name or a [glob pattern]). This overrides components set in the config file.

```shell
# Generate components set in kosko.toml
kosko validate

# Generate components with specified names
kosko validate foo bar

# Generate components matched to the glob pattern
kosko validate nginx_*
```

## Options

### `--env, -e`

Environment name.

### `--set, -s, --set.<component>, -s.<component>`

Override global or component variables on the command line KEY=VAL (can be used multiple times). See decription of the generate command for more details.

### `--require, -r`

Require external modules. Modules set in the config file will also be required.

```shell
# Using TypeScript
kosko validate -r ts-node/register
```

[glob pattern]: https://en.wikipedia.org/wiki/Glob_(programming)
