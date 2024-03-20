---
title: require-probe
---

Require container probes to be specified.

You have to at least enable one of probe in the configuration. Otherwise, the rule will not be enforced. Init containers and ephemeral containers are not checked.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        readinessProbe: { httpGet: { path: "/", port: 80 } }
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
        image: "nginx"
      }
    ]
  }
});
```

## Configuration

### `readiness`

Require readiness probe to be specified.

### `liveness`

Require liveness probe to be specified.

### `startup`

Require startup probe to be specified.
