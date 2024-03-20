---
title: no-missing-role
---

Disallow missing Role and ClusterRole references.

This rule ensures that all Role and ClusterRole references are defined by checking if the corresponding manifests are present or not.

The following built-in ClusterRoles are always allowed:

- `admin`
- `cluster-admin`
- `edit`
- `view`
- `system:*`

The following built-in Roles in `kube-system` namespace are always allowed:

- `extension-apiserver-authentication-reader`
- `system:*`

## Configuration

### `allow`

Allow Role and ClusterRole references that match the patterns to be missing.

#### Examples {#allow-examples}

Allow a ClusterRole with a specific name.

```toml
allow = [{ kind = "ClusterRole", name = "foo" }]
```

Allow a Role with a specific namespace and name.

```toml
allow = [{ kind = "Role", namespace = "foo", name = "bar" }]
```
