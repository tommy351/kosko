---
title: Folder Structure
---

## Default Structure

By default, all environment files are stored in `environments` folder as below.

```shell
.
└── environments
    ├── dev
    │   ├── index.js
    │   └── nginx.js
    └── prod
        ├── index.js
        └── nginx.js
```

You can configure path of environment files in `kosko.toml`. The default setting are:

```toml title="kosko.toml"
[paths.environment]
global = "environments/#{environment}"
component = "environments/#{environment}/#{component}"
```

## Larger Project

:::note Examples

- [Alternative Folder Structure](https://github.com/tommy351/kosko/tree/master/examples/alternative-folder-structure)

:::

If you have tens or hundreds of components, moving environment files closer to your components might be better, so you don't need to jump between `components` and `environments` folder frequently.

### Configuration

You can configure [`paths.environment.component`](configuration.md#pathsenvironmentcomponent) in `kosko.toml` to change the path of component environment files as below.

```toml title="kosko.toml"
[paths.environment]
component = "components/#{component}/#{environment}"
```

And the updated folder structure will be like this.

```shell
.
├── components
│   └── nginx
│       ├── dev.js
│       ├── index.js
│       └── prod.js
└── environments
    ├── dev.js
    └── prod.js
```

### TypeScript

Type definitions can also be moved to `components` folder. For example, you can move type of component variables to `components/<component>/types.ts`, and import them in `typings/@kosko__env/index.d.ts`.

```ts title="typings/@kosko__env/index.d.ts"
import NginxEnvironment from "../../components/nginx/types";
import "@kosko/env";

declare module "@kosko/env" {
  interface GlobalEnvironment {
    imageRegistry: string;
  }

  interface ComponentEnvironment {
    [key: string]: unknown;
    nginx: NginxEnvironment;
  }

  interface Environment {
    global(): GlobalEnvironment;

    component<K extends string>(
      name: K
    ): GlobalEnvironment & ComponentEnvironment[K];
  }
}
```
