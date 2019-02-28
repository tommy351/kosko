# @kosko/require

[Docs](https://github.com/tommy351/kosko)

## API

### `requireDefault`

Import default from ES modules.

```js
requireDefault(id: string): any
```

### `resolve`

Resolves path to the specified module. See [resolve](https://www.npmjs.com/package/resolve) for more info.

```js
resolve(id: string, opts: resolve.AsyncOpts): Promise<string>
```
