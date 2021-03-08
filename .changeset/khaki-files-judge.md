---
"@kosko/require": major
---

Add support for ECMAScript modules.

The following functions are added:

- `isESMSupported` - Return true if ECMAScript modules are supported in the current environment.
- `importPath` - Imports a module from the given path.
- `resolveESM` - Resolves path to the specified module. Returns ECMAScript module path when available.
- `getRequireExtensions` - Returns file extensions which can be imported.

Breaking changes:

- `resolve` does not allow `resolve.AsyncOpts` anymore. Only `ResolveOptions` is allowed instead.
