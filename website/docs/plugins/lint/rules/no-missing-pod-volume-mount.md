---
title: no-missing-pod-volume-mount
---

Disallow missing volume mounts in pods.

This rule ensures that all volume mounts in a pod are defined by checking if the corresponding volumes are present or not.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        volumeMounts: [{ name: "config", mountPath: "/etc/nginx" }]
      }
    ],
    volumes: [{ name: "config", configMap: { name: "nginx" } }]
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
        volumeMounts: [{ name: "config", mountPath: "/etc/nginx" }]
      }
    ]
  }
});
```
