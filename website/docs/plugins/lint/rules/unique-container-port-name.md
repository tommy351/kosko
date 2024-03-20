---
title: unique-container-port-name
---

Require container port names to be unique within a pod.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "a",
        ports: [
          { containerPort: 80, name: "http" },
          { containerPort: 443, name: "https" }
        ]
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
        name: "a",
        ports: [
          { containerPort: 80, name: "http" },
          { containerPort: 443, name: "http" }
        ]
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
        name: "a",
        ports: [{ containerPort: 80, name: "http" }]
      },
      {
        name: "b",
        ports: [{ containerPort: 443, name: "http" }]
      }
    ]
  }
});
```
