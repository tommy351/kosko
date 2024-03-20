---
"@kosko/generate": major
---

`path` and `index` properties are replaced by `position` property in `Manifest` type, `ResolveErrorOptions` type and `ResolveError` class.'

```ts
// Before
{
  path: string;
  index: number[];
  data: unknown;
}

// After
{
  position: {
    path: string;
    index: number[];
  };
  data: unknown;
}
```
