---
title: kosko generate
---

Generate Kubernetes manifests.

```shell
kosko generate [components..]
```

## Positionals

### `components`

Components to generate. It can be either a component's name or a [glob pattern]. This overrides components set in the config file.

```shell
# Generate components specified in kosko.toml
kosko generate

# Generate components with specified names
kosko generate foo bar

# Generate components matched to the glob pattern
kosko generate nginx_*
```

## Options

### `--bail`

:::info
Available since v3.0.0.
:::

Stop immediately when an error occurred.

### `--config, -c`

:::info
Available since v3.0.0.
:::

Config path. Default to `kosko.toml` in current folder.

### `--env, -e`

Environment name.

### `--loader`

:::info
Available since v3.0.0.
:::

Use [module loaders](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#loaders). This option only works when ECMAScript modules (ESM) is enabled.

```shell
# Using TypeScript
kosko generate --loader ts-node/esm
```

### `--require, -r`

Require external modules. Modules set in the config file will also be required.

```shell
# Using TypeScript
kosko generate -r ts-node/register
```

### `--output, -o`

Output format. The value can be `yaml` or `json`. Default to `yaml`. This option is not available in [`kosko validate`](validate.md) command because it does not output manifests to terminal.

### `--set, -s`

Override global environment variables on the command line KEY=VAL (can be used multiple times).

[JSONPath Expressions](https://www.npmjs.com/package/jsonpath) are supported for keys, keys are prepdended with `$.` automatically.
Value is converted to JSON object if it's possible; otherwise, it's handled as a string.

```shell
# Set multiple arguments
kosko generate --set image.name=mysql --set image.tag=1.3.4

# Override entire array
kosko generate --set imagePullSecrets='[ { "name": "mySecret" } ]'

# Set name of the first item in the array
kosko generate --set imagePullSecrets[0].name=mySecret

# Override value of item of the "secrets"
# array that has "secretKey" in the "name" field
kosko generate --set secrets[?(@.name=="secretKey")].value=secretValue

# Disable deployment of the database, value is parsed as a boolean
kosko generate --set mysql.enabled=false

# Set myService to the "true" string, quotes must be escaped because of shell
kosko generate --set myService=\'true\'

# Set myService to the "true" string using quotes inside of the other quots
kosko generate --set myService='"true"'
```

### `--set.<component>, -s.<component>`

Override variables of the specified component. Format is the same as in the `--set` argument. Component overrides are always applied after the global ones regardless of an order of arguments in the command line.

```shell
# Set mysql port to 3307 for all components and 3308 only for the "backend" component
kosko generate --set.backend mysql.port=3308 --set mysql.port=3307
```

### `--validate`

Validate components. It is enabled by default. It can be disabled by setting `--validate=false`. This option is not available in [`kosko validate`](validate.md) command because validation is always enabled when running [`kosko validate`](validate.md) command.

[glob pattern]: https://en.wikipedia.org/wiki/Glob_(programming)
