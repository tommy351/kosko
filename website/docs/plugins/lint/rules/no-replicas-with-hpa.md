---
title: no-replicas-with-hpa
---

Disallow replicas field when a resource has a HPA.

This rule ensures that the `spec.replicas` field is not defined in a Deployment, StatefulSet, or any resources that can be scaled by HPA, when an associated HPA is defined.

If `spec.replicas` is defined, whenever a resource is updated, Kubernetes will scale the resource to the value defined in the manifest, instead of the value given by the HPA. You can see [more details](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#migrating-deployments-and-statefulsets-to-horizontal-autoscaling) in the Kubernetes documentation.

## Examples

✅ **Correct** manifest for this rule:

```ts
new Deployment({
  spec: {}
});
```

❌ **Incorrect** manifest for this rule:

```ts
new Deployment({
  spec: { replicas: 3 }
});
```

## Configuration

### `allow`

Allow scale target references that match the patterns to skip this rule.

#### Examples {#allow-examples}

Allow a Deployment with a specific namespace and name.

```toml
allow = [{ apiVersion = "apps/v1", kind = "Deployment", namespace = "foo", name = "bar" }]
```
