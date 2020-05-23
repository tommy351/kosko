---
id: getting-started
title: Getting Started
---

## Installation

Install kosko globally with npm.

```shell
npm install -g kosko
```

## Setup

First, run `kosko init` to set up a new kosko directory and `npm install` to install dependencies.

```shell
kosko init example
cd example
npm install
```

## Create a Component

Create a new component with `@kosko/template-deployed-service` template.

```shell
npx @kosko/template-deployed-service --name nginx --image nginx
```

This template creates a new file named `nginx.js` in `components` folder.

## Generate Kubernetes Manifests

Run `kosko generate` to print Kubernetes manifests in the console.

```shell
kosko generate
```

Pipe the output to kubectl to apply to a cluster.

```shell
kosko generate | kubectl apply -f -
```
