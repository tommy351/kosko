---
"@kosko/env": minor
---

Add support for ECMAScript modules. Noted that when you use `@kosko/env` as an ECMAScript module, it returns an `AsyncEnvironment` instead, so you **MUST** add `await` when using these two functions.

```js
// Before
const env = require("@kosko/env");

env.global();
env.component("example");

// After
import env from "@kosko/env";

await env.global();
await env.component("example");
```
