---
title: require-env-name
---

Require environment variable names to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        env: [{ name: "ENV_VAR", value: "value" }]
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
        name: "nginx",
        image: "nginx",
        env: [{ value: "value" }]
      }
    ]
  }
});
```
