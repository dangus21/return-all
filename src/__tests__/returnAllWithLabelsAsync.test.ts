/* eslint-disable @typescript-eslint/no-empty-object-type */
import { describe, expect, expectTypeOf, it } from "vitest";
import { returnAllWithLabelsAsync } from "../returnAllWithLabelsAsync";

describe("returnAllWithLabelsAsync", () => {
  it("should return each async function's result under its label", async () => {
    const result = await returnAllWithLabelsAsync({
      user: async () => ({ id: 1, name: "Alice" }),
      settings: async () => ({ theme: "dark" }),
    });

    expect(result).toEqual({
      user: { id: 1, name: "Alice" },
      settings: { theme: "dark" },
    });
  });

  it("should handle a mix of sync and async functions", async () => {
    const result = await returnAllWithLabelsAsync({
      a: () => ({ x: 1 }),
      b: async () => ({ y: 2 }),
    });

    expect(result).toEqual({ a: { x: 1 }, b: { y: 2 } });
  });

  it("should return an empty object for empty input", async () => {
    const result = await returnAllWithLabelsAsync({});

    expect(result).toEqual({});
  });

  it("should call each function exactly once", async () => {
    let calls = 0;

    await returnAllWithLabelsAsync({
      a: async () => {
        calls++;
        return {};
      },
      b: async () => {
        calls++;
        return {};
      },
    });

    expect(calls).toBe(2);
  });

  it("should run all functions concurrently", async () => {
    const order: number[] = [];

    await returnAllWithLabelsAsync({
      a: async () => {
        await Promise.resolve();
        order.push(1);
        return {};
      },
      b: async () => {
        order.push(2);
        return {};
      },
    });

    expect(order).toEqual([2, 1]);
  });

  it("should keep each result scoped to its own label without merging", async () => {
    const result = await returnAllWithLabelsAsync({
      a: async () => ({ x: 1 }),
      b: async () => ({ x: 2 }),
    });

    expect(result.a).toEqual({ x: 1 });
    expect(result.b).toEqual({ x: 2 });
  });
});

describe("returnAllWithLabelsAsync types", () => {
  it("should type each label independently to its async function's return type", async () => {
    const result = await returnAllWithLabelsAsync({
      user: async () => ({ id: 1, name: "Alice" }),
      settings: async () => ({ theme: "dark" }),
    });

    expectTypeOf(result.user).toEqualTypeOf<{ id: number; name: string }>();
    expectTypeOf(result.settings).toEqualTypeOf<{ theme: string }>();
  });

  it("should unwrap Promise return types per label", async () => {
    const result = await returnAllWithLabelsAsync({
      a: (): Promise<{ x: number }> => Promise.resolve({ x: 1 }),
    });

    expectTypeOf(result.a).toEqualTypeOf<{ x: number }>();
  });

  it("should not merge label types into a single intersection", async () => {
    const result = await returnAllWithLabelsAsync({
      a: async () => ({ x: 1 }),
      b: async () => ({ y: "hello" }),
    });

    expectTypeOf(result.a).toEqualTypeOf<{ x: number }>();
    expectTypeOf(result.b).toEqualTypeOf<{ y: string }>();
  });

  it("should return an empty object type for empty input", async () => {
    const result = await returnAllWithLabelsAsync({});

    expectTypeOf(result).toEqualTypeOf<{}>();
  });
});
