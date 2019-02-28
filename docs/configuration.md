# Configuration

## Example

The following is the full example of `kosko.toml`. Config files must be written in [TOML]. All properties are optional.

```toml
# Global configs
require = ["a"]
components = ["b"]
extensions = ["js", "json"]

# Environment configs
[environments.dev]
require = ["c"]
components = ["d"]

[environments.prod]
require = ["e"]
components = ["f"]

[paths.environment]
global = "environments/#{environment}"
component = "environments/#{environment}/#{component}"
```

## Global Configs

Global configs are always applied.

### `require`

Require external modules.

```toml
# Using TypeScript
require = ["ts-node/register"]
```

### `components`

Components to generate. It can be either a component's name or a [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>).

```toml
# Generate all components in components folder
components = ["*"]

# Generate components with specified names
components = ["foo", "bar"]

# Generate components matched to the glob pattern
components = ["nginx_*"]

# Ignore components
components = ["!foo", "!bar"]
```

### `extensions`

Extension names of components. You don't have to set this option. It's detected automatically from [require.extensions](https://nodejs.org/api/modules.html#modules_require_extensions).

## Environment Configs

Environment configs are applied when you run `kosko generate` with `--env/-e` option. Environment configs are merged with global configs.

```toml
# Applied when env = "dev"
[environments.dev]
require = ["c"]
components = ["d"]

# Applied when env = "prod"
[environments.prod]
require = ["e"]
components = ["f"]
```

## Paths

### `paths.environment.global`

Specify the path to global environment file.

### `paths.environment.component`

Specify the path to component environment file.

[toml]: https://github.com/toml-lang/toml
