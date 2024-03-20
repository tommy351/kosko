---
title: unique-container-name
---

Require container names to be unique within a pod.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [{ name: "foo" }, { name: "bar" }]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [{ name: "foo" }, { name: "foo" }]
  }
});
```
