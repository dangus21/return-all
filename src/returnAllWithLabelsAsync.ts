export type LabeledAsyncFunctions = Record<
  string,
  () => object | Promise<object>
>;
export type LabeledAwaitedReturnTypes<T extends LabeledAsyncFunctions> = {
  [K in keyof T]: Awaited<ReturnType<T[K]>>;
};

export async function returnAllWithLabelsAsync<T extends LabeledAsyncFunctions>(
  args: T,
): Promise<LabeledAwaitedReturnTypes<T>> {
  const entries = await Promise.all(
    Object.entries(args).map(async ([key, fn]) => [key, await fn()] as const),
  );
  return Object.fromEntries(entries) as LabeledAwaitedReturnTypes<T>;
}
