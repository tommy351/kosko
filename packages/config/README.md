# @kosko/config

[Docs](https://github.com/tommy351/kosko)

## API

### `loadConfig`

Parses and validates a config file from the specified path.

```js
loadConfig(path: string): Promise<Config>
```

### `searchConfig`

Searchs config files in the specified directory. Returns an empty object when config files does not exist in the directory.

```js
searchConfig(cwd?: string): Promise<Config>
```

### `getConfig`

Returns environment configs merged with global configs.

```js
getConfig(config: Config, env: string): Required<EnvironmentConfig>
```

### `validate`

Validates data with kosko configuration schema. It throws a ValidationError when validation failed.

```js
validate(data: any): void
```
