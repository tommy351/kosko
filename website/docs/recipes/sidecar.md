---
title: Sidecar
---

This helper function can help you inject sidecar with less code.

For example, if you want to inject an Envoy container to your deployment, you can define a helper function as below.

```ts ts2js
import { IPodSpec } from "kubernetes-models/v1";

export function withEnvoy(spec: IPodSpec): IPodSpec {
  return {
    ...spec,
    containers: [
      ...spec.containers,
      {
        name: "envoy",
        image: "envoyproxy/envoy"
      }
    ]
  };
}
```

And then you can use it in your deployment.

```ts ts2js
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

new Deployment({
  spec: {
    template: {
      spec: withEnvoy({
        containers: [
          {
            name: "my-app",
            image: "my-app"
          }
        ]
      })
    }
  }
});
```
