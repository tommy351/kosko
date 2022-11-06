---
title: Environment Variables
---

This helper function can help you organize environment variables in a pod with an object instead of an array.

```ts ts2js
import { EnvVar } from "kubernetes-models/v1/EnvVar";
import { IEnvVarSource } from "kubernetes-models/v1/EnvVarSource";

export function envVars(
  envs: Record<string, string | IEnvVarSource>
): EnvVar[] {
  return Object.entries(envs).map(([name, value]) => {
    if (typeof value === "string") {
      return new EnvVar({ name, value });
    }

    return new EnvVar({ name, valueFrom: value });
  });
}
```

Let's say you have some environment variables like this.

```ts ts2js
import { Pod } from "kubernetes-models/v1/Pod";

new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        env: [
          { name: "NGINX_HOST", value: "foobar.com" },
          { name: "NGINX_PORT", value: "80" }
        ]
      }
    ]
  }
});
```

The `env` array can be replaced as an object with `envVars` function. It's much shorter and easier to maintain.

```ts ts2js
import { Pod } from "kubernetes-models/v1/Pod";

new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        env: envVars({
          NGINX_HOST: "foobar.com",
          NGINX_PORT: "80"
        })
      }
    ]
  }
});
```

Plus, you can override environment variables with the [spread syntax](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

```ts
envVars({
  ...BASE_ENVS,
  NGINX_PORT: "8080"
});
```

Furthermore, you can define more helper functions to reduce more codes.

```ts ts2js
import { IEnvVarSource } from "kubernetes-models/v1/EnvVarSource";

export function envConfigMapRef(name: string, key: string): IEnvVarSource {
  return {
    configMapKeyRef: { name, key }
  };
}

export function envSecretRef(name: string, key: string): IEnvVarSource {
  return {
    secretKeyRef: { name, key }
  };
}

export function envFieldRef(path: string): IEnvVarSource {
  return {
    fieldRef: {
      fieldPath: path
    }
  };
}
```

```ts
envVars({
  TIMEZONE: envConfigMapRef("my-app", "timezone"),
  PASSWORD: envSecretRef("my-app", "password"),
  POD_NAME: envFieldRef("metadata.name")
});
```
