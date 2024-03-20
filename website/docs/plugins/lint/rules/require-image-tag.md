---
title: require-image-tag
---

Require image tags to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [{ name: "nginx", image: "nginx:1.25" }]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [{ name: "nginx", image: "nginx" }]
  }
});
```
