---
title: "Interface: Reducer"
---

[@kosko/env](../modules/_kosko_env.md).Reducer

Describes a step in the variables overriding chain.

## Properties

### name

• **name**: _string_

Name of the reducer.

Defined in: [packages/env/src/reduce.ts:8](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/reduce.ts#L8)

## Methods

### reduce

▸ **reduce**(`target`: _Record_<string, any\>, `componentName?`: _string_): _Record_<string, any\>

Overrides variables for the specified component.
If component name is not specified then overrides only
global variables.

#### Parameters:

| Name             | Type                   |
| :--------------- | :--------------------- |
| `target`         | _Record_<string, any\> |
| `componentName?` | _string_               |

**Returns:** _Record_<string, any\>

Defined in: [packages/env/src/reduce.ts:15](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/reduce.ts#L15)
