---
id: loading-helm-chart
title: Loading Helm Chart
---

Kosko supports loading manifests from Helm charts. You have to [install the Helm CLI](https://helm.sh/docs/intro/install/) before using this package.

`@kosko/helm` uses [`helm template`](https://helm.sh/docs/helm/helm_template/) command to render Helm chart templates, then use `@kosko/yaml` to load YAML. You can see [loading Kubernetes YAML](loading-kubernetes-yaml.md) for more details about transforming manifests.

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

### Specify Name

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

[kubernetes-models]: https://github.com/tommy351/kubernetes-models-ts
