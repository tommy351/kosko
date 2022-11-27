---
"@kosko/require": major
---

- `isESMSupported` function is removed because all supported Node.js version supports ESM dynamic import (`import()` function) now.
- `importPath` function is removed. Please use `import()` function instead.
- `resolveESM` function is removed.
- The behavior of `resolve` function has been changed. Now it only supports file or directory resolution, Node.js modules resolution is removed.
