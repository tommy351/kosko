---
title: Loading Helm Chart
---

Kosko supports loading manifests from Helm charts. You have to [install the Helm CLI](https://helm.sh/docs/intro/install/) before using this package.

`@kosko/helm` uses the [`helm template`](https://helm.sh/docs/helm/helm_template/) command to render Helm chart templates. Most options of `helm template` command are supported. See [API documentation](api/modules/kosko_helm.md) for available options.

Under the hood, `@kosko/helm` uses `@kosko/yaml` to load YAML, which means the `loadChart` function supports all options of the `loadString` function. See [loading Kubernetes YAML](loading-kubernetes-yaml.md) for more details.

## Installation

Install `@kosko/helm` and [kubernetes-models].

```shell
npm install @kosko/helm kubernetes-models
```

### Load from a Local Chart

```js
const { loadChart } = require("@kosko/helm");

loadChart({
  chart: "./nginx"
});
```

### Load from a Repository

```js
const { loadChart } = require("@kosko/helm");

loadChart({
  chart: "prometheus",
  repo: "https://prometheus-community.github.io/helm-charts",
  version: "13.6.0"
});
```

### Specify Release Name

```js
const { loadChart } = require("@kosko/helm");

loadChart({
  chart: "./nginx",
  name: "http-server"
});
```

### Specify Values

```js
const { loadChart } = require("@kosko/helm");

loadChart({
  chart: "./nginx",
  values: {
    replicaCount: 5
  }
});
```

### Include CRDs

```js
const { loadChart } = require("@kosko/helm");

loadChart({
  chart: "traefik",
  repo: "https://helm.traefik.io/traefik",
  includeCrds: true
});
```

[kubernetes-models]: https://github.com/tommy351/kubernetes-models-ts
