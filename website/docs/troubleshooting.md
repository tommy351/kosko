---
id: troubleshooting
title: Troubleshooting
---

If this page can't solve your problem, please [submit an issue](https://github.com/tommy351/kosko/issues/new) on GitHub.

## YAMLException

This error may occurred when some of components can't be dumped by [js-yaml](https://github.com/nodeca/js-yaml). Please make sure all objects in your components can be stringified or have `toJSON()` implemented.

```shell
YAMLException: unacceptable kind of an object to dump
```

For example, you may accidentally export a `Promise` rather than a `() => Promise`. The former is an `Object` and can't be stringified, while the latter is a `Function` and its return value can be flattened.

```js
async function createApp() {
  return [new Deployment(), new Service()];
}

// Don't
module.exports = createApp();

// Do
module.exports = createApp;
```
