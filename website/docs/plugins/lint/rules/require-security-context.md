---
title: require-security-context
---

Require security context to be specified.

## Examples

Enforce a strict security context.

```toml
[plugins.config.rules.require-security-context]
severity = "error"
config.allowPrivilegeEscalation = false
config.privileged = false
config.runAsNonRoot = true
config.readOnlyRootFilesystem = true
```

✅ **Correct** manifest for this rule:

```ts
new Pod({
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx",
        securityContext: {
          allowPrivilegeEscalation: false,
          privileged: false,
          runAsNonRoot: true,
          readOnlyRootFilesystem: true
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

### `allowPrivilegeEscalation`

Require `allowPrivilegeEscalation` to equal the given value.

### `privileged`

Require `privileged` to equal the given value.

### `runAsNonRoot`

Require `runAsNonRoot` to equal the given value.

### `readOnlyRootFilesystem`

Require `readOnlyRootFilesystem` to equal the given value.
