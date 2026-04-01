import { describe, expect, expectTypeOf, it } from "vitest";
import { returnAllAsync } from "../returnAllAsync";

describe("returnAllAsync", () => {
  it("should merge return values of two async functions", async () => {
    const result = await returnAllAsync(
      async () => ({ a: 1 }),
      async () => ({ b: 2 }),
    );

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should merge return values of sync and async functions", async () => {
    const result = await returnAllAsync(
      () => ({ a: 1 }),
      async () => ({ b: 2 }),
    );

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should return an empty object when called with no arguments", async () => {
    const result = await returnAllAsync();

    expect(result).toEqual({});
  });

  it("should overwrite earlier keys with later keys on conflict", async () => {
    const result = await returnAllAsync(
      async () => ({ a: 1 }),
      async () => ({ a: 2 }),
    );

    expect(result).toEqual({ a: 2 });
  });

  it("should run all functions concurrently", async () => {
    const order: number[] = [];

    await returnAllAsync(
      async () => {
        await Promise.resolve();
        order.push(1);
        return {};
      },
      async () => {
        order.push(2);
        return {};
      },
    );

    expect(order).toEqual([2, 1]);
  });
});

describe("returnAllAsync types", () => {
  it("should type each property from its corresponding async function's return type", async () => {
    const result = await returnAllAsync(
      async () => ({ a: 1 }),
      async () => ({ b: "hello" }),
    );

    expectTypeOf(result.a).toEqualTypeOf<number>();
    expectTypeOf(result.b).toEqualTypeOf<string>();
  });

  it("should unwrap Promise return types", async () => {
    const result = await returnAllAsync(
      (): Promise<{ a: number }> => Promise.resolve({ a: 1 }),
    );

    expectTypeOf(result.a).toEqualTypeOf<number>();
  });

  it("should fall back to Record<string, unknown> for no arguments", async () => {
    const result = await returnAllAsync();

    expectTypeOf(result).toEqualTypeOf<Record<string, unknown>>();
  });
});
