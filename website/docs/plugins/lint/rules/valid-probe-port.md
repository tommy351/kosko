---
title: valid-probe-port
---

Require string container probe ports to be defined in container ports.

Please note that numeric container probe ports are not checked by this rule.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "foo",
        ports: [{ name: "http", containerPort: 80 }],
        livenessProbe: { httpGet: { port: "http" } }
      }
    ]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "foo",
        ports: [{ name: "http", containerPort: 80 }],
        livenessProbe: { httpGet: { port: "https" } }
      }
    ]
  }
});
```

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "foo",
        livenessProbe: { httpGet: { port: "http" } }
      }
    ]
  }
});
```
