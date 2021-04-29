# Using TypeScript

## Configuration

Add `ts-node/register` to `require` in `kosko.toml`.

```toml
require = ["ts-node/register"]
```

## Environment Types

You can specify types of environment variables by extending type declarations of `@kosko/env` module. See [environments](environments) folder for example.

See [docs](https://kosko.dev/docs/typescript-support) for more details.
