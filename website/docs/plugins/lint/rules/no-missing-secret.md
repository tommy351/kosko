---
title: no-missing-secret
---

Disallow missing Secret references.

This rule ensures that all Secret references are defined by checking if the corresponding manifests are present or not.

Besides `Secret`, the following resources are also supported:

| API Group             | Kind             |
| --------------------- | ---------------- |
| `bitnami.com`         | `SealedSecret`   |
| `external-secrets.io` | `ExternalSecret` |
| `seals.kinko.dev`     | `Asset`          |

## Configuration

### `allow`

Allow Secret references that match the patterns to be missing.

#### Examples {#allow-examples}

Allow a specific namespace and name.

```toml
allow = [{ namespace = "foo", name = "bar" }]
```

Allow all names in a specific namespace.

```toml
allow = [{ namespace = "foo", name = "*" }]
```
