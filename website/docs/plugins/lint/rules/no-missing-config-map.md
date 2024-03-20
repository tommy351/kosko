---
title: no-missing-config-map
---

Disallow missing ConfigMap references.

This rule ensures that all ConfigMap references are defined by checking if the corresponding manifests are present or not.

## Configuration

### `allow`

Allow ConfigMap references that match the patterns to be missing.

#### Examples {#allow-examples}

Allow a specific namespace and name.

```toml
allow = [{ namespace = "foo", name = "bar" }]
```

Allow all names in a specific namespace.

```toml
allow = [{ namespace = "foo", name = "*" }]
```
