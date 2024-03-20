---
title: require-service-port-name
---

Require service port names to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Service({
  spec: {
    ports: [
      { name: "http", port: 80 },
      { name: "https", port: 443 }
    ]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Service({
  spec: {
    ports: [{ port: 80 }, { port: 443 }]
  }
});
```

## Configuration

### `always`

Require name to be specified even if there is only one port.
