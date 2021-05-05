# Contributing

## Getting Started

Install [pnpm](https://pnpm.js.org/installation).

```sh
npm install -g pnpm
```

Download dependencies.

```sh
pnpm install
```

Install [Helm](https://helm.sh/docs/intro/install/).

```sh
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

## Developing

Watch changes of TypeScript files and rebuild automatically.

```sh
npm run watch
```

Delete built files.

```sh
npm run clean
```

## Testing

### Unit Tests

Run unit tests.

```sh
npm run test:unit
```

### Integration Tests

Build TypeScript files.

```sh
npm run build
```

Run integration tests.

```sh
npm run test:integration
```

### Browser Tests

Build TypeScript files.

```sh
npm run build
```

Run browser tests.

```sh
npm run test:browser
```

If the tests don't run:

- [Puppeteer troubleshooting](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md)
- For WSL: [puppeteer/puppeteer#1837](https://github.com/puppeteer/puppeteer/issues/1837#issuecomment-689006806)

## Linting

Lint TypeScript and JavaScript files.

```sh
npm run lint
```

## Styleguides

### Code Formatting

We use [Prettier](https://prettier.io/) to format all the code.
