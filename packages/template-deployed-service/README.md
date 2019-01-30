# @kosko/template-deployed-service

[![](https://img.shields.io/npm/v/@kosko/template-deployed-service.svg)](https://www.npmjs.com/package/@kosko/template-deployed-service)

Create a new component including a deployment and a service.

## Usage

```sh
npx @kosko/template-deployed-service --name nginx --image nginx
```

## Options

### `--name`

Name of deployment and service. (Required)

### `--image`

Container image. (Required)

### `--type`

Service type. Default to `ClusterIP`.

### `--servicePort`

Service port. Default to `80`.

### `--containerPort`

Container port. Default to `80`.

### `--replicas`

Number of replicas. Default to `1`.
