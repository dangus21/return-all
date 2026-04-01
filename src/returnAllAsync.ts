export type AsyncFunctionArgs = readonly (() => object | Promise<object>)[];
export type AccumulateAwaitedReturnTypes<T extends AsyncFunctionArgs> =
  T extends readonly [
    infer First extends () => object | Promise<object>,
    ...infer Rest extends AsyncFunctionArgs,
  ]
    ? Awaited<ReturnType<First>> & AccumulateAwaitedReturnTypes<Rest>
    : Record<string, unknown>;

export async function returnAllAsync<T extends AsyncFunctionArgs>(
  ...args: T
): Promise<AccumulateAwaitedReturnTypes<T>> {
  const results = await Promise.all(args.map((fn) => fn()));
  return Object.assign({}, ...results) as AccumulateAwaitedReturnTypes<T>;
}
