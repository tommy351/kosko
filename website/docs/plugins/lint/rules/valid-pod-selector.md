---
title: valid-pod-selector
---

Require deployment selector to equal or be a subset of the pod template labels.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Deployment({
  spec: {
    selector: { matchLabels: { app: "nginx" } },
    template: {
      metadata: { labels: { app: "nginx" } }
    }
  }
});
```

```ts
new Deployment({
  spec: {
    selector: { matchLabels: { app: "nginx" } },
    template: {
      metadata: { labels: { app: "nginx", tier: "backend" } }
    }
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Deployment({
  spec: {
    selector: { matchLabels: { app: "nginx" } },
    template: {
      metadata: { labels: { app: "mysql" } }
    }
  }
});
```
