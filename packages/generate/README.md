# @kosko/generate

[Docs](https://github.com/tommy351/kosko)

## API

### `generate`

Finds components with glob patterns in the specified path and returns exported values from each components.

```js
generate(options: GenerateOptions): Promise<Result>
```

### `print`

Print result to a stream.

```js
print(result: Result, options: PrintOptions): void
```
