export type SyncFunctionArgs = readonly (() => object)[];
export type AccumulateReturnTypes<T extends SyncFunctionArgs> =
	T extends readonly [
		infer First extends () => object,
		...infer Rest extends SyncFunctionArgs
	]
		? ReturnType<First> & AccumulateReturnTypes<Rest>
		: Record<string, unknown>;

type EnsureSyncFn<T> = T extends () => infer R
	? R extends PromiseLike<unknown>
		? "Error: async functions are not allowed in returnAll, use returnAllAsync instead"
		: T
	: T;

export function returnAll<
	T extends SyncFunctionArgs & { [K in keyof T]: EnsureSyncFn<T[K]> }
>(...args: T): AccumulateReturnTypes<T> {
	return Object.assign(
		{},
		...args.map((fn) => fn())
	) as AccumulateReturnTypes<T>;
}
