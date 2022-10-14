---
"@kosko/cli": minor
---

- When running `init` command, install latest dependencies instead of the given versions in `package.json`.
- Add `--package-manager` option to `init` command. If this option is not specified, Kosko will detect package manager based on the presence of `yarn.lock` or `pnpm-lock.yaml` in the target path.
