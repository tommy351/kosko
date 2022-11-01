---
title: Components
---

A component is a collection of Kubernetes manifests including all resources needed for an application, such as a `Deployment`, a `Service` or a `Secret`.

## Folder Structure

A component should be placed in `components/<name>.js` or `components/<name>/index.js`.

```shell
.
└── components
    ├── foo
    │   └── index.js
    └── nginx.js
```

When you run [`kosko generate`](cli/generate.md), Kosko will find all files or folders in `components` folder that matching the pattern set in [`components`](configuration.md#components) configuration (it is `*` by default, which means everything in components folder). You can add component names or patterns to the command to specify which components to generate.

```shell
# Use `components` in `kosko.toml`.
kosko generate

# Specify which components to generate
kosko generate nginx dev_*
```

## Basic

Let's start with a basic component. In the following example, we will create a new file `components/busybox.js` that exports a `Pod`.

```ts ts2js
import { Pod } from "kubernetes-models/v1/Pod";

const pod = new Pod({
  metadata: { name: "busybox" },
  spec: {
    containers: [{ name: "busybox", image: "busybox" }]
  }
});

export default pod;
```

Then you can run [`kosko generate`](cli/generate.md) to print YAML.

```shell
kosko generate
# apiVersion: v1
# kind: Pod
# metadata:
#   name: busybox
# spec:
#   containers:
#     - name: busybox
#       image: busybox
```

At the first line, we import `Pod` class from [kubernetes-models] package. This is a separated package which is generated automatically from [Kubernetes OpenAPI Specification](https://github.com/kubernetes/kubernetes/tree/master/api/openapi-spec). It provides type definitions and validation. You can import corresponding resources as below.

```ts
// Class
import { Kind } from "kubernetes-models/<apiVersion>/<kind>";

// Interface
import { IKind } from "kubernetes-models/<apiVersion>/<kind>";
```

Kind can be omitted from the import path if you want to import multiple resources at a time. Please note that this might have impact on the module loading speed.

```ts
import { Pod, Service } from "kubernetes-models/v1";
```

[kubernetes-models] also supports custom resource definitions (CRDs). You can see [here](https://github.com/tommy351/kubernetes-models-ts#3rd-party-models) for a full list of supported 3rd-party models.

```ts
import { Certificate } from "@kubernetes-models/cert-manager/cert-manager.io/v1/Certificate";
```

If the CRD package is not available yet, or you want to skip validation on certain manifests, Kosko also supports plain objects.

```ts
const pod = {
  apiVersion: "v1",
  kind: "Pod"
};
```

## Export More Manifests

In the following example, we will create a file `components/nginx.js` that exports a `Deployment` and `Service`.

```ts ts2js
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Service } from "kubernetes-models/v1/Service";

const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata: { name: "nginx" },
  spec: {
    selector: {
      matchLabels: labels
    },
    template: {
      metadata: { labels },
      spec: {
        containers: [{ name: "nginx", image: "nginx" }]
      }
    }
  }
});

const service = new Service({
  metadata: { name: "nginx" },
  spec: {
    selector: labels,
    ports: [{ port: 80 }]
  }
});

export default [deployment, service];
```

At the last line, we replace the export value with an array. So when you run [`kosko generate`](cli/generate.md), it will print YAML as below.

```shell
kosko generate
# ---
# apiVersion: apps/v1
# kind: Deployment
# (omitted)
# ---
# apiVersion: v1
# kind: Service
# (omitted)
```

### Function

You can also export a function that returns an array of manifests.

```ts
export default function () {
  return [new Deployment(), new Service()];
}
```

### Async Function

```ts
export default async function () {
  return [new Deployment(), new Service()];
}
```

### Iterable

Besides array, objects which implements [the iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol), such as `Set`, `Map` or generator functions, are also supported.

```ts
// Set
export default new Set([new Deployment(), new Service()]);

// Generator function
function* gen() {
  yield new Deployment();
  yield new Service();
}

export default gen();
```

### Async Iterable

```ts
// Async generator function
async function* gen() {
  yield new Deployment();
  yield new Service();
}

export default gen();
```

## Nested Manifests

:::info
Available since v1.0.0.
:::

All of the patterns we just mentioned above can be combined together. It is very useful for reusing manifests across components.

For example, we can create a function that returns a database as a resource, and use it later in components.

```ts ts2js
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Service } from "kubernetes-models/v1/Service";

function createDatabase(name: string) {
  const metadata = { name: `${name}-db` };
  return [new Deployment({ metadata }), new Service({ metadata })];
}

export default [
  createDatabase("my-app"),
  new Deployment({ metadata: { name: "my-app" } }),
  new Service({ metadata: { name: "my-app" } })
];
```

All manifests in arrays and functions will be flattened. Below is YAML output.

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-db
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-db
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
---
apiVersion: v1
kind: Service
metadata:
  name: my-app
```

[kubernetes-models]: https://github.com/tommy351/kubernetes-models-ts
