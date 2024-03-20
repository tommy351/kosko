---
"@kosko/generate": major
---

Add `keepAjvErrors` option. Ajv validation errors are transformed into issues automatically by default now. This could be a breaking change if you expect `generate` and `resolve` function to throw Ajv validation errors. You can disable this behavior by setting `keepAjvErrors` to `true`.
