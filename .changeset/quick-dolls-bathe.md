---
"@kosko/migrate": minor
---

Add support for ESM format. Output format is CommonJS (`cjs`) on Node.js and ESM (`esm`) on other platforms by default. You can provide `format` option to override the default value.

```ts
// CommonJS
migrate([], { format: MigrateFormat.CJS });

// ESM
migrate([], { format: MigrateFormat.ESM });
```
