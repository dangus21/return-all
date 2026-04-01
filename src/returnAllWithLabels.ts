export type LabeledSyncFunctions = Record<string, () => object>;
export type LabeledReturnTypes<T extends LabeledSyncFunctions> = {
	[K in keyof T]: ReturnType<T[K]>;
};

type EnsureNotAsyncFn<T> = T extends () => infer R
	? R extends PromiseLike<unknown>
		? "Error: async functions are not allowed in returnAllWithLabels, use returnAllWithLabelsAsync instead"
		: T
	: T;

export function returnAllWithLabels<
	T extends LabeledSyncFunctions & { [K in keyof T]: EnsureNotAsyncFn<T[K]> }
>(args: T): LabeledReturnTypes<T> {
	return Object.fromEntries(
		Object.entries(args).map(([key, fn]) => [key, fn()])
	) as LabeledReturnTypes<T>;
}
