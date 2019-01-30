# @kosko/generate

## Write a Component

A component contains one or many Kubernetes manifests. It can be written in the following styles.

### Single Manifest

```js
const { Deployment } = require("kubernetes-models/api/apps/v1");

module.exports = new Deployment();
```

### Multiple Manifests

```js
const { Deployment } = require("kubernetes-models/api/apps/v1");
const { Service } = require("kubernetes-models/api/core/v1");

module.exports = [new Deployment(), new Service()];
```

### In a Function

```js
const { Deployment } = require("kubernetes-models/api/apps/v1");
const { Service } = require("kubernetes-models/api/core/v1");

module.exports = function() {
  return [new Deployment(), new Service()];
};
```

### In a Async Function

```js
const { Deployment } = require("kubernetes-models/api/apps/v1");
const { Service } = require("kubernetes-models/api/core/v1");

module.exports = async function() {
  return [new Deployment(), new Service()];
};
```

## API

### `generate`

Finds components with glob patterns in the specified path and returns exported values from each components.

```js
generate(options: GenerateOptions): Promise<Result>
```

### `print`

Print result to a stream.

```js
print(result: Result, options: PrintOptions): void
```
