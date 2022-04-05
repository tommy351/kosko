---
title: Introducing Kustomize Support
---

Kosko now supports Kustomize files. With the new `@kosko/kustomize` package, you can load your existing Kustomize files into Kosko, and it also supports Kubernetes OpenAPI schema validation.

`@kosko/kustomize` uses the `kustomize build` or `kubectl kustomize` command to generate Kubernetes manifests and the `@kosko/yaml` package to load Kubernetes YAML.

First, you have to install either [`kustomize`](https://kubectl.docs.kubernetes.io/installation/kustomize/) or [`kubectl`](https://kubectl.docs.kubernetes.io/installation/kubectl/) CLI, then install the `@kosko/kustomize` package.

```shell
npm install @kosko/kustomize
```

Next, use the `loadKustomize` function to load Kustomize files.

```js
const { loadKustomize } = require("@kosko/kustomize");

loadKustomize({
  path: "./dir"
});
```

See [loading Kustomize](/docs/components/loading-kustomize) for more details.
