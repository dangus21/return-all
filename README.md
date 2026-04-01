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
import { returnAll } from 'return-all';

const result = returnAll(
  () => ({ name: 'Alice' }),
  () => ({ age: 30 }),
);

// result: { name: string } & { age: number }
console.log(result.name); // 'Alice'
console.log(result.age);  // 30
```

### `returnAllAsync`

Same as `returnAll` but supports async functions. All functions are invoked concurrently via `Promise.all`.

```ts
import { returnAllAsync } from 'return-all';

const result = await returnAllAsync(
  async () => ({ user: await fetchUser() }),
  async () => ({ settings: await fetchSettings() }),
);

// result: { user: User } & { settings: Settings }
```

## API

### `returnAll(...fns)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `...fns` | `(() => object)[]` | Functions whose return values will be merged |

Returns the merged object typed as the intersection of all return types.

### `returnAllAsync(...fns)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `...fns` | `(() => object \| Promise<object>)[]` | Sync or async functions whose return values will be merged |

Returns a `Promise` that resolves to the merged object typed as the intersection of all awaited return types.

## License

MIT

