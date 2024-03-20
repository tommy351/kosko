---
title: require-namespace
---

Require a namespace to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  metadata: { name: "foo", namespace: "default" }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Pod({
  metadata: { name: "foo" }
});
```

```ts
new Pod({
  metadata: { name: "foo", namespace: "" }
});
```
