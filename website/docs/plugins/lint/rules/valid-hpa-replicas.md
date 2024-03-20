---
title: valid-hpa-replicas
---

Require HPA replicas to be valid.

## Examples

✅ **Correct** manifest for this rule:

```ts
new HorizontalPodAutoscaler({
  spec: {
    minReplicas: 1,
    maxReplicas: 10
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new HorizontalPodAutoscaler({
  spec: {
    minReplicas: 10,
    maxReplicas: 1
  }
});
```

```ts
new HorizontalPodAutoscaler({
  spec: { maxReplicas: 0 }
});
```
