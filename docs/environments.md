# Environments

## Create Environments

You can create a new component by using `@kosko/template-environment` template.

```sh
npx @kosko/template-environment --name dev
```

## Define Environments

The following is the folder structure of `environments` folder.

```sh
environments
├── dev
│   ├── index.js
│   └── nginx.js
└── prod
    ├── index.js
    └── nginx.js
```

### Global Variables

Global variables are defined in `environments/<env>/index.js`.

```js
module.exports = {
  imageRegistry: "gcr.io/image-dev"
};
```

### Component Variables

Component variables are defined in `environments/<env>/<component>.js`.

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
