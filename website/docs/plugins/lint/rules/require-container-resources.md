---
title: require-container-resources
---

Require container resources to be specified.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        resources: {
          requests: { cpu: "100m", memory: "100Mi" }
        }
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

### `init`

Require resources to be specified for init containers.

### `ephemeral`

Require resources to be specified for ephemeral containers.

### `requests`

Require resources to contain specified requests.

#### Examples {#requests-examples}

```toml
requests = ["cpu", "memory"]
```

### `limits`

Require resources to contain specified limits.

#### Examples {#limits-examples}

```toml
limits = ["cpu", "memory"]
```
