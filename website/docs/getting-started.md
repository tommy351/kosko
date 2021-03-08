---
id: getting-started
title: Getting Started
slug: /
---

:::note Examples

- [Getting Started](https://github.com/tommy351/kosko/tree/master/examples/getting-started)

:::

## Setup

Run `kosko init` to set up a new kosko directory.

```shell
npx kosko init example
```

This command will create a new folder named `example`, and generate a `package.json` inside the folder. The version may not be the same as the example below. It's depended on the version of kosko you installed.

```json title="package.json"
{
  "dependencies": {
    "@kosko/env": "^1.1.0",
    "kosko": "^1.1.0",
    "kubernetes-models": "^1.5.2"
  }
}
```

Next, run `npm install` inside the folder we just created.

```shell
cd example
npm install
```

## Create a Component

Create a new component with `@kosko/template-deployed-service` template.

```shell
npx @kosko/template-deployed-service --name nginx --image nginx
```

This template creates a new file named `nginx.js` in `components` folder.

```js title="components/nginx.js"
"use strict";

const { Deployment } = require("kubernetes-models/apps/v1/Deployment");
const { Service } = require("kubernetes-models/v1/Service");

const metadata = { name: "nginx" };
const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata,
  spec: {
    replicas: 1,
    selector: {
      matchLabels: labels
    },
    template: {
      metadata: {
        labels
      },
      spec: {
        containers: [
          {
            image: "nginx",
            name: "nginx",
            ports: [
              {
                containerPort: 80
              }
            ]
          }
        ]
      }
    }
  }
});

const service = new Service({
  metadata,
  spec: {
    selector: labels,
    type: "ClusterIP",
    ports: [
      {
        port: 80,
        targetPort: 80
      }
    ]
  }
});

module.exports = [deployment, service];
```

## Generate Kubernetes Manifests

Run `kosko generate` to print Kubernetes manifests in the console.

```shell
npx kosko generate
```

Pipe the output to kubectl to apply to a cluster.

```shell
npx kosko generate | kubectl apply -f -
```
