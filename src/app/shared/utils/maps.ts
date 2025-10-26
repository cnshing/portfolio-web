/**
 * Applies a function to every key, value in the object
 * Modified from https://stackoverflow.com/a/74553065.
 @export
 * @template {PropertyKey} K Any key of `obj`.
 * @template V Any value of `obj`.
 * @template RV Any arbitrary result of `keyfn(k, v)`
 * @template {PropertyKey} [RK=K] Any arbitrary result of `keyfn(k, v)`
 * @param {{ [P in K]: V }} obj
 * @param {(key: K, value: V, index?: number) => RV} [valuefn=(_, value) => value as unknown as RV] Any function that takes in the obj's key, value, and optional index number to return a result.
 * @param {(key: K, value: V, index?: number) => RK} [keyfn=(key) => key as unknown as RK] Any function that takes in the obj's key, value, and optional index number to return a result.
 * @returns {{ [P in RK]: RV }} A new object representing { keyfn(k, v): valuefn(k, v) for k, v in obj}
 */

export function ObjectMap<K extends PropertyKey, V, RV, RK extends PropertyKey = K>(
  obj: { [P in K]: V },
  valuefn: (key: K, value: V, index?: number) => RV = (_, value) => value as unknown as RV,   keyfn: (key: K, value: V, index?: number) => RK = (key) => key as unknown as RK,
): { [P in RK]: RV } {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value], index) => [keyfn(key as K, value as V, index), valuefn(key as K, value as V, index)]),
    // assert --------------------------------> ^^^^^
  ) as { [P in RK]: RV }
  //^^^^^^^^^^^^^^^^^^ <-- assert
}