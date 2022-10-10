---
"@kosko/cli": minor
---

More human-readable error message for `generate` and `validate` command. Below is an example of validation error message.

```
components/nginx.js - 2 errors

  ✖ ResolveError: Validation error
    Index: [0]
    Kind: apps/v1/Deployment
    Name: nginx

      /spec/replicas must be integer

  ✖ ResolveError: Validation error
    Index: [1]
    Kind: v1/Service
    Name: nginx

      /spec/ports/0/port must be integer
      /spec/type must be equal to one of the allowed values: ["ClusterIP","ExternalName","LoadBalancer","NodePort"]

error - Generate failed (Total 2 errors)
```
