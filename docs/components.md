# Components

## Create Components

Create components by using [templates](templates.md) or add files to `components` folder. For example:

```sh
components
└── nginx.js
```

You can also split manifests into multiple files and export them in `index.js`.

```sh
components
└── nginx
    ├── deployment.js
    ├── index.js
    └── service.js
```

## Declare Manifests

Export manifests to `module.exports` in CommonJS modules or `export default` in ES modules. It can be written in the following styles.

### Single Manifest

```js
const { Deployment } = require("kubernetes-models/apps/v1");

module.exports = new Deployment();
```

### Multiple Manifests

```js
const { Deployment } = require("kubernetes-models/apps/v1");
const { Service } = require("kubernetes-models/v1");

module.exports = [new Deployment(), new Service()];
```

### In a Function

```js
const { Deployment } = require("kubernetes-models/apps/v1");
const { Service } = require("kubernetes-models/v1");

module.exports = function() {
  return [new Deployment(), new Service()];
};
```

### In a Async Function

```js
const { Deployment } = require("kubernetes-models/apps/v1");
const { Service } = require("kubernetes-models/v1");

module.exports = async function() {
  return [new Deployment(), new Service()];
};
```

## Validate Manifests

### Built-in Validation

We use [kubernetes-models](https://github.com/tommy351/kubernetes-models-ts) by default. This package validates against Kubernetes OpenAPI schema.

### Custom Validation

Create a class with `validate()` method and throw an error when the validation failed.

```js
class Pod {
  validate() {
    if (!this.metadata.name) {
      throw new Error("metadata.name is required");
    }
  }
}
```
