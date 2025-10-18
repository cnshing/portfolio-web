
/**
 * Applies a function to every key, value in the object
 * Modified from https://stackoverflow.com/a/74553065.
 * @export
 * @template {PropertyKey} K Any key of `obj`.
 * @template V Any value of `obj`.
 * @template R Any arbitrary result of `callbackfn(k, v)`
 * @param {{ [P in K]: V }} obj Object to apply `callbackfn(k, v)`
 * @param {(key: K, value: V, index?: number) => R} callbackfn Any function that takes in the obj's key and value and returns any result.
 * @returns {{ [P in K]: R }} A new object representing { k: callbackfn(k, v) for k, v in obj}
 */
export function ObjectMap<K extends PropertyKey, V, R>(
  obj: { [P in K]: V },
  callbackfn: (key: K, value: V, index?: number) => R,
): { [P in K]: R } {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value], index) => [key, callbackfn(key as K, value as V, index)]),
    // assert --------------------------------> ^^^^^
  ) as { [P in K]: R }
  //^^^^^^^^^^^^^^^^^^ <-- assert
}

