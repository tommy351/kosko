---
title: require-container-port-name
---

Require container port names to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        ports: [
          { containerPort: 80, name: "http" },
          { containerPort: 443, name: "https" }
        ]
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
        ports: [{ containerPort: 80 }, { containerPort: 443 }]
      }
    ]
  }
});
```

## Configuration

### `always`

Require name to be specified even if there is only one port.
