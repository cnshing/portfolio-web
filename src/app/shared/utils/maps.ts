
/**
 * Applies a function to every key, value in the object
 * Modified from https://stackoverflow.com/a/74553065.
 @export
 * @template {PropertyKey} K Any key of `obj`.
 * @template V Any value of `obj`.
 * @template RV Any arbitrary result of `keyfn(k, v)`
 * @template {PropertyKey} [RK=K] Any arbitrary result of `keyfn(k, v)`
 * @param {{ [P in K]: V }} obj The object to map.
 * @param {(key: K, value: V) => RV} valuefn Any function that takes in the obj's key, value to return a result.
 * @param {(key: K, value: V) => RK} keyfn Any function that takes in the obj's key, value to return a result.
 * @returns {{ [P in RK]: RV }} A new object representing { keyfn(k, v): valuefn(k, v) for k, v in obj}
 */
export function objectMap<K extends PropertyKey, V, RV, RK extends PropertyKey = K>(
  obj: { [P in K]: V },
  valuefn: (value: V, key: K) => RV = (value) => value as unknown as RV,   keyfn: (key: K, value: V) => RK = (key) => key as unknown as RK,
): { [P in RK]: RV } {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [keyfn(key as K, value as V), valuefn(value as V, key as K)]),
    // assert --------------------------------> ^^^^^
  ) as { [P in RK]: RV }
  //^^^^^^^^^^^^^^^^^^ <-- assert
}

