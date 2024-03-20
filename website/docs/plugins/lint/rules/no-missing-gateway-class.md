---
title: no-missing-gateway-class
---

Disallow missing GatewayClass references.

This rule ensures that all GatewayClass references are defined by checking if the corresponding manifests are present or not.

## Configuration

### `allow`

Allow GatewayClass references that match the patterns to be missing.

#### Examples {#allow-examples}

Allow GKE gateway classes.

```toml
allow = ["gke-*"]
```
