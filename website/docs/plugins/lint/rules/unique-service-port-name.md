---
title: unique-service-port-name
---

Require service port names to be unique within a service.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Service({
  spec: {
    ports: [
      { name: "http", port: 80 },
      { name: "https", port: 443 }
    ]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Service({
  spec: {
    ports: [
      { name: "http", port: 80 },
      { name: "http", port: 443 }
    ]
  }
});
```
