export type LabeledSyncFunctions = Record<string, () => object>;
export type LabeledReturnTypes<T extends LabeledSyncFunctions> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export function returnAllWithLabels<T extends LabeledSyncFunctions>(
  args: T,
): LabeledReturnTypes<T> {
  return Object.fromEntries(
    Object.entries(args).map(([key, fn]) => [key, fn()]),
  ) as LabeledReturnTypes<T>;
}
