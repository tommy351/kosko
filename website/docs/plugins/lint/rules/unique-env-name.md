---
title: unique-env-name
---

Require environment variable names to be unique within a container.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "foo",
        env: [{ name: "ENV_VAR", value: "a" }]
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
        env: [
          { name: "ENV_VAR", value: "a" },
          { name: "ENV_VAR", value: "b" }
        ]
      }
    ]
  }
});
```
