# @kosko/env

[Docs](https://github.com/tommy351/kosko)

## API

### `env`

Current environment.

```js
env?: string;
```

### `cwd`

Path to the working directory. Default to CWD.

```js
cwd: string;
```

### `paths`

Paths of environment files.

```js
paths: {
  global: string,
  component: string
}
```

### `global`

Returns global variables.

If env is not set or require failed, returns an empty object.

```js
global(): any
```

### `component`

Returns component variables merged with global variables.

If env is not set or require failed, returns an empty object.

```js
component(name: string): any
```
