# @kosko/template

[Docs](https://github.com/tommy351/kosko)

## API

### `run`

Parse command line arguments and generate files with a template.

```js
run(template: Template<any>, argv?: string[]): Promise<void>
```

### `writeFiles`

Write files to the specified path.

```js
writeFiles(path: string, files: ReadonlyArray<File>): Promise<void>
```
