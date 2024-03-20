---
title: valid-cron-job-schedule
---

Require cron job schedules to be valid.

See [Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#schedule-syntax) for more information about schedule syntax.

## Examples

✅ **Correct** manifest for this rule:

```ts
new CronJob({
  spec: {
    schedule: "5 * * * *"
  }
});
```

❌ **Incorrect** manifest for this rule:

```ts
new CronJob({
  spec: {
    schedule: "5 * * *"
  }
});
```
