This is a [Kosko] project bootstrapped with [`kosko init`][kosko] command.

## Getting Started

Generate Kubernetes manifests with the following command.

```sh
npm run generate
```

The result will be printed in the console. You can pipe the output to `kubectl` to apply generated manifests on Kubernetes.

```sh
npm run --silent generate | kubectl apply -f -
```

When `--env` option is set, Kosko will read variables from environment files. Then you can fetch variables with `@kosko/env` package.

```sh
npm run generate -- --env dev
```

You can try editing files in `components` and `environments` folder and re-run `npm run generate` to see changes.

## Learn More

Check [Kosko docs](https://kosko.dev/docs/) for more information about Kosko.

[kosko]: https://kosko.dev/
