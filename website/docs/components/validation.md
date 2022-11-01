---
title: Validation
---

When you run [`kosko generate`](cli/generate.md) or [`kosko validate`](cli/validate.md), Kosko will run `validate()` method of every exported manifests.

## Error

For example, when a manifest is invalid.

```ts ts2js
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

const deployment = new Deployment({
  metadata: {
    name: "nginx",
    namespace: "dev"
  },
  spec: {
    replicas: "INVALID" // This should be a number
  }
});

export default [deployment];
```

Kosko will throw an error as below, which includes error details and location of invalid manifests.

```
components/nginx.js - 1 error

  ✖ ResolveError: Validation error
    Index: [0]
    Kind: apps/v1/Deployment
    Namespace: dev
    Name: nginx

      /spec/replicas must be integer

error - Generate failed (Total 1 error)
```

Below are description of each field.

- **Index**: Location of manifest in a component. In this example, `[0]` means it is the first manifest in the component.
- **Kind**: `apiVersion` and `kind` of manifest.
- **Namespace**: `metadata.namespace` of manifest.
- **Name**: `metadata.name` of manifest.

## Built-in Validation

All classes in [kubernetes-models](https://github.com/tommy351/kubernetes-models-ts) package support `validate()` method, so you don't need to implement it manually.

## Custom Validation

Create a class with `validate()` method and throws an error when the validation failed.

```ts ts2js
class Pod {
  validate() {
    if (!this.metadata.name) {
      throw new Error("metadata.name is required");
    }
  }
}
```

You can also override `validate()` method of existing classes.

```ts ts2js
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

class MyDeployment extends Deployment {
  validate() {
    super.validate();

    if (this.spec.replicas < 1) {
      throw new Error("replicas must be at least 1");
    }
  }
}
```

## Disable Validation

To disable validation on certain manifests, you can call `toJSON()` method to convert a manifest into a plain object, or just create a plain object instead.

```ts
// Use toJSON method,
new Pod().toJSON();

// or just create a plain object.
{
  "apiVerison": "v1",
  "kind": "Pod"
}
```

To disable validation on all manifests, run [`kosko generate`](cli/generate.md) with `--validate=false` option.

```shell
kosko generate --validate=false
```
