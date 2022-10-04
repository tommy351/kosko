---
"@kosko/generate": major
---

- All errors in `resolve` function are wrapped with `ResolveError` for better access to context information (e.g. path, kind, name, etc.).
- Errors in `generate` function are wrapped with `GenerateError` for better access to context.
- `ValidationError` and `ValidationErrorOptions` are renamed as `ResolveError` and `ResolveErrorOptions` since it's not only used for validation now.
- All properties in `ResolveError` and `ResolveErrorOptions` are no longer required now.
- `ResolveError.message` no longer contains context information. You can access context from stack or direct access properties in the error value.
- The format of `ResolveError.stack` has been changed as below.

  ```
  ResolveError: Validation error
      Path: /path/example
      Index: [1, 2, 3]
      Kind: apps/v1/Deployment
      Name: nginx
      Cause: ValidationError: data/spec is required
          at ...
      at ...
  ```

- `generate` and `resolve` function now collect all errors rather than stop immediately when an error occurred. You can set `bail: true` to stop immediately. When there are more than one error, they will be wrapped with [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError).
- `resolve` function now supports [`Iterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) (e.g. `Array`, `Set`, `Map`, generator) and [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) (e.g. async generator).
- [`fast-glob`](https://github.com/mrmlnc/fast-glob) is replaced with a homemade glob function based on [`micromatch`](https://github.com/micromatch/micromatch). The behavior will be slightly different. Please submit an issue if you encounter any unexpected problems.
- Errors in `generate` function are wrapped with `GenerateError` for better access
