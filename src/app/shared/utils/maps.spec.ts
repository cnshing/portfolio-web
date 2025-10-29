import { objectMap } from "./maps";

describe("objectMap", () => {
  it("should apply identity functions when no keyfn/valuefn are given", () => {
    const input = { a: 1, b: 2 };
    const output = objectMap(input);
    expect(output).toEqual({ a: 1, b: 2 });
  });

  it("should apply valuefn correctly", () => {
    const input = { a: 1, b: 2 };
    const output = objectMap(input, (v) => v * 2);
    expect(output).toEqual({ a: 2, b: 4 });
  });

  it("should apply keyfn correctly", () => {
    const input = { a: 1, b: 2 };
    const output = objectMap(input, undefined, (k)  => k.toUpperCase());
    expect(output).toEqual({ A: 1, B: 2 });
  });

  it("should apply both keyfn and valuefn", () => {
    const input = { a: 1, b: 2 };
    const output = objectMap(
      input,
      (v) => v + 10,
      (k) => `key_${k}`,
    );
    expect(output).toEqual({ key_a: 11, key_b: 12 });
  });

  it("should return an empty object for an empty input", () => {
    const output = objectMap({});
    expect(output).toEqual({});
  });
});