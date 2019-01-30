# @kosko/env

## Define an Environment

### Create an Environment

You can create a new component by using `@kosko/template-environment` template.

```sh
npx @kosko/template-environment --name dev
```

This template will create a new folder named `dev` in `environments` folder with `index.js` in it.

```sh
environments
└── dev
    └── index.js
```

### Global Variables

Global variables are defined in `environments/<env>/index.js`. Variables which shared across all components should be defined in this file.

```js
module.exports = {
  imageRegistry: "gcr.io/image-dev"
};
```

### Component Variables

Component variables are defined in `environments/<env>/<component>.js`. Component-specified variables should be defined in this file.

```js
module.exports = {
  replicas: 3,
  port: 8080
};
```

## Retrieve Variables

### Get Current Environment

```js
require("@kosko/env").env === "dev";
```

### Global Variables

Retrieve global variables with `global()` function.

```js
require("@kosko/env").global() === require("./environments/dev");
```

### Component Variables

Retrieve component variables with `component()` function. It returns a merge of global variables and variables of the specified component.

```js
require("@kosko/env").component("nginx") ===
  {
    ...require("@kosko/env").global(),
    ...require("./environments/dev/nginx")
  };
```

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
