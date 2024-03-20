---
title: no-missing-scale-target
---

Disallow missing scale target references defined in HPAs.

This rule ensures that all scale target references defined in HPAs are present by checking if the corresponding manifests are present or not.

## Configuration

### `allow`

Allow scale target references that match the patterns to be missing.

#### Examples {#allow-examples}

Allow a Deployment with a specific namespace and name.

```toml
allow = [{ apiVersion = "apps/v1", kind = "Deployment", namespace = "foo", name = "bar" }]
```
