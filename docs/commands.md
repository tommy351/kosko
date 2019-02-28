# Commands

## Usage

```sh
kosko <command>
```

### Options

#### `--cwd`

Set path to the working directory. Default to the current working directory (CWD).

#### `--silent`

Disable log output.

## `init`

Set up a new kosko directory.

```sh
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

```sh
kosko generate [components..]
```

### Positionals

#### `components`

Components to generate. It can be either a component's name or a [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>). This overrides components set in the config file.

```sh
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

#### `--require, -r`

Require external modules. Modules set in the config file will also be required.

```sh
# Using TypeScript
kosko generate -r ts-node/register
```

#### `--output, -o`

Output format. The value can be `yaml` or `json`. Default to `yaml`.

#### `--validate`

Validate components. It is enabled by default. It can be disabled by setting `--no-validate` or `--validate=false`.

### Examples

```sh
# Print components to console
kosko generate

# Apply to Kubernetes cluster
kosko generate | kubectl apply -f -
```

## `validate`

Validate components.

```sh
kosko validate [components..]
```

### Positionals

#### `components`

Components to generate. It can be either a component's name or a [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>). This overrides components set in the config file.

```sh
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

#### `--require, -r`

Require external modules. Modules set in the config file will also be required.

```sh
# Using TypeScript
kosko generate -r ts-node/register
```

## `migrate`

Migrate Kubernetes YAML into kosko components.

```sh
kosko migrate
```

### Options

#### `--filename, -f`

File, directory or stdin to migrate.

```sh
# Read from a file or a directory
kosko migrate -f path/to/file

# Read from stdin
kosko migrate -f -
```

### Examples

```sh
kosko migrate -f nginx.yml > components/nginx.js
```
