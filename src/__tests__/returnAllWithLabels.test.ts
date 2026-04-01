/* eslint-disable @typescript-eslint/no-empty-object-type */
import { describe, expect, expectTypeOf, it } from "vitest";
import { returnAllWithLabels } from "../returnAllWithLabels";

describe("returnAllWithLabels", () => {
  describe("behaviour", () => {
    it("should return each function's result under its label", () => {
      const result = returnAllWithLabels({
        user: () => ({ id: 1, name: "Alice" }),
        settings: () => ({ theme: "dark" }),
      });

      expect(result).toEqual({
        user: { id: 1, name: "Alice" },
        settings: { theme: "dark" },
      });
    });

    it("should return an empty object for empty input", () => {
      const result = returnAllWithLabels({});

      expect(result).toEqual({});
    });

    it("should call each function exactly once", () => {
      let calls = 0;

      returnAllWithLabels({
        a: () => {
          calls++;
          return {};
        },
        b: () => {
          calls++;
          return {};
        },
      });

      expect(calls).toBe(2);
    });

    it("should keep each result scoped to its own label without merging", () => {
      const result = returnAllWithLabels({
        a: () => ({ x: 1 }),
        b: () => ({ x: 2 }),
      });

      expect(result.a).toEqual({ x: 1 });
      expect(result.b).toEqual({ x: 2 });
    });
  });

  describe("types", () => {
    it("should type each label independently to its function's return type", () => {
      const result = returnAllWithLabels({
        user: () => ({ id: 1, name: "Alice" }),
        settings: () => ({ theme: "dark" }),
      });

      expectTypeOf(result.user).toEqualTypeOf<{ id: number; name: string }>();
      expectTypeOf(result.settings).toEqualTypeOf<{ theme: string }>();
    });

    it("should not merge label types into a single intersection", () => {
      const result = returnAllWithLabels({
        a: () => ({ x: 1 }),
        b: () => ({ y: "hello" }),
      });

      expectTypeOf(result.a).toEqualTypeOf<{ x: number }>();
      expectTypeOf(result.b).toEqualTypeOf<{ y: string }>();
    });

    it("should return an empty object type for empty input", () => {
      const result = returnAllWithLabels({});

      expectTypeOf(result).toEqualTypeOf<{}>();
    });
  });
});
