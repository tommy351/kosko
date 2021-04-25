---
title: "Class: AsyncEnvironment"
---

[@kosko/env](../modules/_kosko_env.md).AsyncEnvironment

## Hierarchy

- _BaseEnvironment_

  ↳ **AsyncEnvironment**

## Constructors

### constructor

\+ **new AsyncEnvironment**(`cwd`: _string_): [_AsyncEnvironment_](_kosko_env.asyncenvironment.md)

#### Parameters:

| Name  | Type     |
| :---- | :------- |
| `cwd` | _string_ |

**Returns:** [_AsyncEnvironment_](_kosko_env.asyncenvironment.md)

Defined in: [packages/env/src/environment/base.ts:27](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L27)

## Properties

### cwd

• **cwd**: _string_

---

### env

• `Optional` **env**: _string_ \| _string_[]

Current environment.

Defined in: [packages/env/src/environment/base.ts:12](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L12)

---

### extensions

• **extensions**: _string_[]

File extensions of environments.

Defined in: [packages/env/src/environment/base.ts:25](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L25)

---

### paths

• **paths**: [_Paths_](../interfaces/_kosko_env.paths.md)

Paths of environment files.

Defined in: [packages/env/src/environment/base.ts:17](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L17)

---

### reducers

• `Protected` **reducers**: [_Reducer_](../interfaces/_kosko_env.reducer.md)[]

Defined in: [packages/env/src/environment/base.ts:7](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L7)

## Methods

### component

▸ **component**(`name`: _string_): _any_

Returns component variables merged with global variables.

If env is not set or require failed, returns an empty object.

#### Parameters:

| Name   | Type     | Description    |
| :----- | :------- | :------------- |
| `name` | _string_ | Component name |

**Returns:** _any_

Defined in: [packages/env/src/environment/base.ts:53](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L53)

---

### execReducers

▸ `Protected`**execReducers**(`name?`: _string_): _any_

#### Parameters:

| Name    | Type     |
| :------ | :------- |
| `name?` | _string_ |

**Returns:** _any_

Defined in: [packages/env/src/environment/async.ts:8](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/async.ts#L8)

---

### global

▸ **global**(): _any_

Returns global variables.

If env is not set or require failed, returns an empty object.

**Returns:** _any_

Defined in: [packages/env/src/environment/base.ts:42](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L42)

---

### mergeValues

▸ `Protected`**mergeValues**(`values`: _any_[]): _any_

#### Parameters:

| Name     | Type    |
| :------- | :------ |
| `values` | _any_[] |

**Returns:** _any_

Defined in: [packages/env/src/environment/async.ts:12](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/async.ts#L12)

---

### requireModule

▸ `Protected`**requireModule**(`id`: _string_): _Promise_<any\>

#### Parameters:

| Name | Type     |
| :--- | :------- |
| `id` | _string_ |

**Returns:** _Promise_<any\>

Defined in: [packages/env/src/environment/async.ts:16](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/async.ts#L16)

---

### resetReducers

▸ **resetReducers**(): _void_

Resets reducers to the defaults.

**Returns:** _void_

Defined in: [packages/env/src/environment/base.ts:67](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L67)

---

### setReducers

▸ **setReducers**(`callbackfn`: (`reducers`: [_Reducer_](../interfaces/_kosko_env.reducer.md)[]) => [_Reducer_](../interfaces/_kosko_env.reducer.md)[]): _void_

Sets list of reducers using the specified callback function.

#### Parameters:

| Name         | Type                                                                                                                   |
| :----------- | :--------------------------------------------------------------------------------------------------------------------- |
| `callbackfn` | (`reducers`: [_Reducer_](../interfaces/_kosko_env.reducer.md)[]) => [_Reducer_](../interfaces/_kosko_env.reducer.md)[] |

**Returns:** _void_

Defined in: [packages/env/src/environment/base.ts:60](https://github.com/tommy351/kosko/blob/93cd0b7/packages/env/src/environment/base.ts#L60)
