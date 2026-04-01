import { describe, expect, expectTypeOf, it } from "vitest";
import { returnAll } from "../returnAll";

describe("returnAll", () => {
	it("should merge return values of two functions", () => {
		const result = returnAll(
			() => ({ a: 1 }),
			() => ({ b: 2 })
		);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	it("should return an empty object when called with no arguments", () => {
		const result = returnAll();

		expect(result).toEqual({});
	});

	it("should overwrite earlier keys with later keys on conflict", () => {
		const result = returnAll(
			() => ({ a: 1 }),
			() => ({ a: 2 })
		);

		expect(result).toEqual({ a: 2 });
	});

	it("should call each function exactly once", () => {
		let calls = 0;

		returnAll(
			() => {
				calls++;
				return { a: 1 };
			},
			() => {
				calls++;
				return { b: 2 };
			}
		);

		expect(calls).toBe(2);
	});
});

describe("returnAll types", () => {
	it("should type each property from its corresponding function's return type", () => {
		const result = returnAll(
			() => ({ a: 1 }),
			() => ({ b: "hello" })
		);

		expectTypeOf(result.a).toEqualTypeOf<number>();
		expectTypeOf(result.b).toEqualTypeOf<string>();
	});

	it("should fall back to Record<string, unknown> for no arguments", () => {
		const result = returnAll();

		expectTypeOf(result).toEqualTypeOf<Record<string, unknown>>();
	});

	it("should reject async functions at the type level", () => {
		// @ts-expect-error async functions are not allowed in returnAll
		void returnAll(async () => ({ a: 1 }));
	});
});
