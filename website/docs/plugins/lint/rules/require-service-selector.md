---
title: require-service-selector
---

Require service selectors to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Service({
  spec: {
    selector: { app: "nginx" },
    ports: [{ port: 80 }]
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Service({
  spec: {
    ports: [{ port: 80 }]
  }
});
```

```ts
new Service({
  spec: {
    selector: {},
    ports: [{ port: 80 }]
  }
});
```

## Configuration

### `allow`

Allow services that matches the patterns to not have selectors. This is useful when you want to maintain a list of endpoints that are not managed by Kubernetes. See [Kubernetes documentation](https://kubernetes.io/docs/concepts/services-networking/service/#services-without-selectors) for more information.

Allow a specific namespace and name.

```toml
allow = [{ namespace = "foo", name = "bar" }]
```

Allow all names in a specific namespace.

```toml
allow = [{ namespace = "foo", name = "*" }]
```
