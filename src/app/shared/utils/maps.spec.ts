import { ObjectMap } from "./maps";

describe("ObjectMap", () => {
  it("should apply identity functions when no keyfn/valuefn are given", () => {
    const input = { a: 1, b: 2 };
    const output = ObjectMap(input);
    expect(output).toEqual({ a: 1, b: 2 });
  });

  it("should apply valuefn correctly", () => {
    const input = { a: 1, b: 2 };
    const output = ObjectMap(input, (v) => v * 2);
    expect(output).toEqual({ a: 2, b: 4 });
  });

  it("should apply keyfn correctly", () => {
    const input = { a: 1, b: 2 };
    const output = ObjectMap(input, undefined, (k)  => k.toUpperCase());
    expect(output).toEqual({ A: 1, B: 2 });
  });

  it("should apply both keyfn and valuefn", () => {
    const input = { a: 1, b: 2 };
    const output = ObjectMap(
      input,
      (v) => v + 10,
      (k) => `key_${k}`,
    );
    expect(output).toEqual({ key_a: 11, key_b: 12 });
  });

  it("should return an empty object for an empty input", () => {
    const output = ObjectMap({});
    expect(output).toEqual({});
  });
});