# Configuration

You can write configuration in `kosko.toml` so you don't have to specify options every time you run `kosko generate`.

## Syntax

The following is a full example of a configuration file. Config files must be written in [TOML]. All properties are optional.

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

### Global Configs

Global configs are always applied. `--require/-r` arguments are merged with configs. Components in arguments override configs.

### Environment Configs

Environment configs are applied when environment (`--env/-e`) is specified.

### Extensions

File extensions of components. It's inferred from [`require.extensions`](https://nodejs.org/api/modules.html) by default. You don't have to set it manually.

### Paths

By default, kosko finds environment files in `environments` folder. You can override it by setting `paths.environment`.

[toml]: https://github.com/toml-lang/toml
