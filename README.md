# return-all

Merge the return values of multiple functions into a single fully-typed object.

## Installation

```sh
npm install return-all
```

## Usage

### `returnAll`

Calls each function synchronously and deeply merges their return values. The result is typed as the intersection of all return types.

```ts
import { returnAll } from "return-all";

const result = returnAll(
	() => ({ name: "Alice" }),
	() => ({ age: 30 })
);

// result: { name: string } & { age: number }
console.log(result.name); // 'Alice'
console.log(result.age); // 30
```

### `returnAllAsync`

Same as `returnAll` but supports async functions. All functions are invoked concurrently via `Promise.all`.

```ts
import { returnAllAsync } from "return-all";

const result = await returnAllAsync(
	async () => ({ user: await fetchUser() }),
	async () => ({ settings: await fetchSettings() })
);

// result: { user: User } & { settings: Settings }
```

### `returnAllWithLabels`

Like `returnAll` but each function is assigned a named label. Results are scoped to their label rather than merged into a flat intersection.

```ts
import { returnAllWithLabels } from "return-all";

const { user, settings } = returnAllWithLabels({
	user: () => getUser(),
	settings: () => getSettings()
});

// user: ReturnType<typeof getUser>
// settings: ReturnType<typeof getSettings>
```

### `returnAllWithLabelsAsync`

Like `returnAllWithLabels` but supports async functions. All functions are invoked concurrently via `Promise.all`.

```ts
import { returnAllWithLabelsAsync } from "return-all";

const { user, settings } = await returnAllWithLabelsAsync({
	user: async () => fetchUser(),
	settings: async () => fetchSettings()
});

// user: Awaited<ReturnType<typeof fetchUser>>
// settings: Awaited<ReturnType<typeof fetchSettings>>
```

## API

### `returnAll(...fns)`

| Parameter | Type               | Description                                  |
| --------- | ------------------ | -------------------------------------------- |
| `...fns`  | `(() => object)[]` | Functions whose return values will be merged |

Returns the merged object typed as the intersection of all return types.

### `returnAllAsync(...fns)`

| Parameter | Type                                  | Description                                                |
| --------- | ------------------------------------- | ---------------------------------------------------------- |
| `...fns`  | `(() => object \| Promise<object>)[]` | Sync or async functions whose return values will be merged |

Returns a `Promise` that resolves to the merged object typed as the intersection of all awaited return types.

### `returnAllWithLabels(fns)`

| Parameter | Type                           | Description                        |
| --------- | ------------------------------ | ---------------------------------- |
| `fns`     | `Record<string, () => object>` | Object mapping labels to functions |

Returns an object where each key holds the return value of its corresponding function, typed independently per label.

### `returnAllWithLabelsAsync(fns)`

| Parameter | Type                                              | Description                                      |
| --------- | ------------------------------------------------- | ------------------------------------------------ |
| `fns`     | `Record<string, () => object \| Promise<object>>` | Object mapping labels to sync or async functions |

Returns a `Promise` that resolves to an object where each key holds the awaited return value of its corresponding function, typed independently per label.

## License

MIT
