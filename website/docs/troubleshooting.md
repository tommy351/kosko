---
title: Troubleshooting
---

If this page can't solve your problem, please [submit an issue](https://github.com/tommy351/kosko/issues/new) on GitHub.

## YAMLException

This error may occurred when some of components can't be dumped by [js-yaml](https://github.com/nodeca/js-yaml). Please make sure all objects in your components can be stringified or have `toJSON()` implemented.

```shell
YAMLException: unacceptable kind of an object to dump
```
