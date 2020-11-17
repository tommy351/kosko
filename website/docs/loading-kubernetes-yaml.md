---
id: loading-kubernetes-yaml
title: Loading Kubernetes YAML
---

If you already have lots of existing Kubernetes YAML files, you don't have to rewrite all of them in JavaScript. Kosko provides two ways for you to load Kubernetes YAML files.

## Load YAML Files

:::info
This feature works better with [nested manifests](components.md#nested-manifests), which is available with v1.0.0 and above.
:::

This is the easiest way to import your existing Kubernetes YAML files. It's recommended to try this first if you don't need to manipulate YAML files. All manifests except custom resource definitions (CRD) are created with [kubernetes-models], so they are validated against Kubernetes OpenAPI schema.

### Installation

```shell
npm install @kosko/yaml kubernetes-models
```

### Load from a File

```js
const { loadFile, loadUrl, loadString } = require("@kosko/yaml");

loadFile("manifest.yaml");
```

### Load from a URL

```js
const { loadUrl } = require("@kosko/yaml");

// Load from a URL
loadUrl(
  "https://github.com/jetstack/cert-manager/releases/download/v1.0.4/cert-manager.yaml"
);
```

You can customize headers or method in options. See [node-fetch](https://github.com/node-fetch/node-fetch#options) for more information about available options.

```js
loadUrl("", {
  method: "POST",
  headers: {
    Authorization: "token"
  }
});
```

### Load from a String

```js
const { loadString } = require("@kosko/yaml");

loadString(`
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
`);
```

### Transform Manifests

```js
const { loadFile } = require("@kosko/yaml");

loadFile("manifest.yaml", {
  transform(manifest) {
    // Remove all manifests whose namespace is "foo"
    if (manifest.metadata.namespace === "foo") {
      return null;
    }

    // Set all service type as "ClusterIP"
    if (manifest.apiVersion === "v1" && manifest.kind === "Service") {
      manifest.spec.type = "ClusterIP";
    }

    // You must return the manifest, otherwise it will be removed.
    return manifest;
  }
});
```

### Custom Resources

Register custom resource definitions (CRD) with `setResourceModule` function.

```js
const { setResourceModule } = require("@kosko/yaml");

setResourceModule(
  {
    apiVersion: "projectcontour.io/v1",
    kind: "HTTPProxy"
  },
  {
    path: "@kubernetes-models/contour/projectcontour.io/v1/HTTPProxy",
    export: "HTTPProxy"
  }
);
```

### Opt-out Validation

By default, all manifests except custom resource definitions (CRD) are created with [kubernetes-models]. If you don't want to validate them for some reasons, you can transform them into plain objects, or override the `validate` method.

```js
loadFile("manifest.yaml", {
  tranform(manifest) {
    // Return the plain object
    if (typeof manifest.toJSON === "function") {
      return manifest.toJSON();
    }

    // Override the validate method
    manifest.validate = () => {};

    return manifest;
  }
});
```

## Migrate YAML Files

If you want to maximize the power of kosko, you can try to migrate your existing Kubernetes YAML files into JavaScript files.

```shell
# Read from file or a directory
kosko migrate -f manifest.yaml > components/nginx.js

# Read from stdin
cat manifest.yaml | kosko migrate -f - > components/nginx.js
```

See [commands](commands.md#migrate) for more information about available options.

[kubernetes-models]: https://github.com/tommy351/kubernetes-models-ts
