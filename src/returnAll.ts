export type SyncFunctionArgs = readonly (() => object)[];
export type AccumulateReturnTypes<T extends SyncFunctionArgs> =
  T extends readonly [
    infer First extends () => object,
    ...infer Rest extends SyncFunctionArgs,
  ]
    ? ReturnType<First> & AccumulateReturnTypes<Rest>
    : Record<string, unknown>;

export function returnAll<T extends SyncFunctionArgs>(
  ...args: T
): AccumulateReturnTypes<T> {
  return Object.assign(
    {},
    ...args.map((fn) => fn()),
  ) as AccumulateReturnTypes<T>;
}
