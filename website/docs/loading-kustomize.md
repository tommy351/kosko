---
title: Loading Kustomize
---

Kosko supports loading manifests from Kustomize files. You have to install either [`kustomize`](https://kubectl.docs.kubernetes.io/installation/kustomize/) or [`kubectl`](https://kubectl.docs.kubernetes.io/installation/kubectl/) CLI before using this package.

`@kosko/kustomize` uses the `kustomize build` command to generate Kubernetes manifests. Most options of `kustomize build` command are supported. See [API documentation](api/modules/kosko_kustomize.md) for available options.

Under the hood, `@kosko/kustomize` uses `@kosko/yaml` to load YAML, which means the `loadKustomize` function supports all options of the `loadString` function. See [loading Kubernetes YAML](loading-kubernetes-yaml.md) for more details.

## Installation

Install `@kosko/kustomize` and [kubernetes-models].

```shell
npm install @kosko/kustomize kubernetes-models
```

### Load from a local directory

Load Kubernetes manifests from a local directory which contains a `kustomization.yaml` file. For example, you can use `__dirname` to load manifests from the current directory.

```js
const { loadKustomize } = require("@kosko/kustomize");

loadKustomize({
  path: "./dir"
});
```

### Load from a URL

You can also load manifests from a URL. See [Kustomize docs](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/resource/) for supported URL formats.

```js
const { loadKustomize } = require("@kosko/kustomize");

loadKustomize({
  path: "github.com/kubernetes-sigs/kustomize/examples/multibases?ref=v1.0.6"
});
```

### Specify the Build Command

By default, `loadKustomize` function uses `kustomize build` command to generate Kubernetes manifests, and fallbacks to `kubectl kustomize` command if `kustomize` CLI is not installed.

You can also customize the build command with the `buildCommand` option if `kustomize` or `kubectl` is not present in your `PATH`.

```js
const { loadKustomize } = require("@kosko/kustomize");

loadKustomize({
  path: "./dir",
  buildCommand: ["./path/to/kustomize", "build"]
});
```
