---
id: typescript-support
title: TypeScript Support
---

:::note Examples

- [TypeScript](https://github.com/tommy351/kosko/tree/master/examples/typescript)

:::

Kosko and [kubernetes-models](https://github.com/tommy351/kubernetes-models-ts) are written in TypeScript, so you don't have to install any additional type declaration files.

## Configuration

To start using TypeScript, you have to either add [`require`](configuration.md#require) option in `kosko.toml`, or run Kosko with [`-r/--require`](commands.md#--require--r) option.

```toml title="kosko.toml"
require = ["ts-node/register"]
```

## Environment Types

You can specify types of environment variables by extending type declarations of `@kosko/env` module.

```ts title="environments/types.d.ts"
import * as env from "@kosko/env";

// Declare types for global environment variables
declare interface GlobalEnvironment {
  imageRegistry: string;
}

// Declare types for component environment variables
declare interface ComponentEnvironment {
  // Fallback type of all other component variables which are not specified below
  [key: string]: unknown;

  // Specify types for each component
  nginx: {
    replicas: number;
  };
}

// Extend type declarations of "@kosko/env" module
declare module "@kosko/env" {
  // Extend Environment interface
  interface Environment {
    global(): GlobalEnvironment;

    component<K extends string>(
      name: K
    ): GlobalEnvironment & ComponentEnvironment[K];
  }
}
```
