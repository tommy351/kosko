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
```

### Global Configs

Global configs are always applied. You can still specify additional arguments when running `kosko generate`. Configs and arguments are merged. For example:

```js
// kosko generate x y --require z
require = ["a", "z"];
components = ["b", "x", "y"];
```

### Environment Configs

Environment configs are applied when environment (`--env/-e`) is specified. For example:

```js
// kosko generate x y --require z --env dev
require = ["a", "c", "z"];
components = ["b", "d", "x", "y"];
```

[toml]: https://github.com/toml-lang/toml
