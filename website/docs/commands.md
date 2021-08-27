---
title: Commands
---

## Usage

```shell
kosko <command>
```

### Options

#### `--cwd`

Set path to the working directory. Default to the current working directory (CWD).

#### `--silent`

Disable log output.

## `init`

Set up a new kosko directory.

```shell
kosko init [path]
```

### Positionals

#### `path`

Path to initialize. Default to the current directory.

### Options

#### `--force, -f`

Overwrite existing files.

## `generate`

Generate Kubernetes manifests.

```shell
kosko generate [components..]
```

### Positionals

#### `components`

Components to generate. It can be either a component's name or a [glob pattern]). This overrides components set in the config file.

```shell
# Generate components set in kosko.toml
kosko generate

# Generate components with specified names
kosko generate foo bar

# Generate components matched to the glob pattern
kosko generate nginx_*
```

### Options

#### `--env, -e`

Environment name.

#### `--set, -s`

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

#### `--set.<component>, -s.<component>`

Override variables of the specified component. Format is the same as in the `--set` argument. Component overrides are always applied after the global ones regardless of an order of arguments in the command line.

```shell
# Set mysql port to 3307 for all components and 3308 only for the "backend" component
kosko generate --set.backend mysql.port=3308 --set mysql.port=3307
```

#### `--require, -r`

Require external modules. Modules set in the config file will also be required.

```shell
# Using TypeScript
kosko generate -r ts-node/register
```

#### `--output, -o`

Output format. The value can be `yaml` or `json`. Default to `yaml`.

#### `--validate`

Validate components. It is enabled by default. It can be disabled by setting `--no-validate` or `--validate=false`.

### Examples

```shell
# Print components to console
kosko generate

# Apply to Kubernetes cluster
kosko generate | kubectl apply -f -
```

## `validate`

Validate components.

```shell
kosko validate [components..]
```

### Positionals

#### `components`

Components to generate. It can be either a component's name or a [glob pattern]). This overrides components set in the config file.

```shell
# Generate components set in kosko.toml
kosko validate

# Generate components with specified names
kosko validate foo bar

# Generate components matched to the glob pattern
kosko validate nginx_*
```

### Options

#### `--env, -e`

Environment name.

#### `--set, -s, --set.<component>, -s.<component>`

Override global or component variables on the command line KEY=VAL (can be used multiple times). See decription of the generate command for more details.

#### `--require, -r`

Require external modules. Modules set in the config file will also be required.

```shell
# Using TypeScript
kosko validate -r ts-node/register
```

## `migrate`

Migrate Kubernetes YAML into kosko components.

```shell
kosko migrate
```

### Options

#### `--filename, -f`

File, directory or stdin to migrate.

```shell
# Read from a file or a directory
kosko migrate -f path/to/file

# Read from stdin
kosko migrate -f -
```

### Examples

```shell
kosko migrate -f nginx.yml > components/nginx.js
```

[glob pattern]: https://en.wikipedia.org/wiki/Glob_(programming)
