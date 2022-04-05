---
title: Environments
---

Environments are variables specific to different clusters or namespaces. There are two types of variables:

- **Global Variables** - Shared across all components.
- **Component Variables** - Only used within a component.

## Create Environments

You can create a new component by using [`@kosko/template-environment`](https://github.com/tommy351/kosko/tree/master/packages/template-environment) template.

```shell
npx @kosko/template-environment --name dev
```

## Define Environments

The following is the folder structure of `environments` folder.

```shell
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

The `env` value can be a string, an array of strings or undefined.

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

## Specify Environments

When running `kosko generate` or `kosko validate`, use [`-e,--env`](commands.md#--env--e) to specify environments.

```shell
kosko generate -e dev
```

You can also set [`baseEnvironment`](configuration.md#baseenvironment) as the default environment.

```toml title="kosko.toml"
baseEnvironment = "dev"
```
