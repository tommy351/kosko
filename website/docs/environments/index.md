---
title: Environments
---

Environments are variables specific to different clusters or namespaces.

## Specify Environments

When running [`kosko generate`](cli/generate.md) or [`kosko validate`](cli/validate.md), use [`--env, -e`](cli/generate.md#--env--e) to specify environments.

```shell
kosko generate -e prod
```

You can also set [`baseEnvironment`](configuration.md#baseenvironment) as the default environment.

```toml title="kosko.toml"
baseEnvironment = "base"
```

## Global Variables

Global variables are shared across all components. They are defined in `environments/<env>/index.js`.

```ts ts2js title="environments/prod/index.js"
export default {
  imageRegistry: "gcr.io/acme-prod",
  namespace: "prod"
};
```

Once global variables are set, you can retrieve them with `global()` function.

```ts ts2js
import env from "@kosko/env";

const params = env.global();
// {
//   imageRegistry: "gcr.io/acme-prod",
//   namespace: "prod"
// }
```

## Component Variables

Component variables should only be used within a component. However, you can still retrieve them from another components. If you find a component variable is used by multiple components, you should consider move it to global variables.

Component variables are defined in `environments/<env>/<component>.js`.

```ts ts2js title="environments/prod/nginx.js"
export default {
  replicas: 3,
  imageVersion: "stable"
};
```

Once component variables are set, you can retrieve them with `component()` function. It returns deep merge of global and component variables.

```ts ts2js
import env from "@kosko/env";

const params = env.component("nginx");
// {
//   imageRegistry: "gcr.io/acme-prod",
//   namespace: "prod",
//   replicas: 3,
//   imageVersion: "stable"
// }
```

## Get Current Environment

You can fetch current environment from `env` property. Depending on the value of [`--env, -e`](cli/generate.md#--env--e) and [`baseEnvironment`](configuration.md#baseenvironment) option, it could be `string`, `string[]` or `undefined`.

```ts ts2js
import env from "@kosko/env";

const currentEnv = env.env;
// "prod"
// ["base", "prod"]
// undefined
```
