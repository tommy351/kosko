---
title: require-container-image
---

Require container images to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [{ name: "nginx", image: "nginx" }]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [{ name: "nginx" }]
  }
});
```

```ts
new Pod({
  spec: {
    containers: [{ name: "nginx", image: "" }]
  }
});
```
