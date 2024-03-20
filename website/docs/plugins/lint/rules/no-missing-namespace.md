---
title: no-missing-namespace
---

Disallow missing Namespace references.

This rule ensures that all Namespace references are defined by checking if the corresponding manifests are present or not.

Built-in namespaces such as `default`, `kube-system` are always allowed.

## Configuration

### `allow`

Allow Namespace references that match the patterns to be missing.

#### Examples {#allow-examples}

Allow a specific namespace.

```toml
allow = ["foo"]
```
