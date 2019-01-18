# Configuration

You can write configuration in `kosko.toml` so you don't have to specify options every time you run `kosko generate`.

## Syntax

The following is a full example of a configuration file. Config files must be written in [TOML]. All properties are optional.

```toml
# Global configs
require = ["a"]
components = ["b"]

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

### Paths

By default, kosko finds environment files in `environments` folder. You can override it by setting `paths.environment`.

[toml]: https://github.com/toml-lang/toml
