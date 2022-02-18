---
title: Getting Started
slug: /
---

Welcome to the Kosko documentation! Before we start, make sure your computer meets the following system requirements.

- Node.js 12 or later.

## Automatic Setup

It's recommended to setup a Kosko project with [`kosko init`](commands.md#init) command, which sets up basic folder structure and installs everything you need automatically.

```sh
npx kosko init example
```

We also recommend using TypeScript, which can improve user experience in IDE and make debugging much easier. To set up a TypeScript project, run:

```sh
npx kosko init example --typescript
```

After the installation complete, the command will generate following files in `example` folder.

```
├── README.md
├── components
│   └── nginx.js
├── environments
│   └── dev
│       ├── index.js
│       └── nginx.js
├── kosko.toml
├── package-lock.json
└── package.json
```

## Manual Setup

Install `kosko`, `@kosko/env` and `kubernetes-models`.

```sh
npm install kosko @kosko/env kubernetes-models
```

Add the following `scripts` to your `package.json`.

```json
{
  "scripts": {
    "generate": "kosko generate",
    "validate": "kosko validate"
  }
}
```

Create a new component with `@kosko/template-deployed-service` template.

```sh
npx @kosko/template-deployed-service --name nginx --image nginx
```

## Generate Kubernetes Manifests

Run `kosko generate` to print Kubernetes manifests in the console.

```shell
npm run generate
```

Pipe the output to kubectl to apply to a cluster.

```shell
npm run --silent generate | kubectl apply -f -
```
