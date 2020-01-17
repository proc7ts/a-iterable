/**
 * @module a-iterable
 */
import { isArrayLike } from './api';
import { itsRevertible, RevertibleIterable } from './revertible-iterable';
import { itsIterator, makeIt } from './util';

/**
 * Constructs a reversed iterable.
 *
 * If the `source` iterable is an array-like structure, then uses `reverseArray()` function to revert the constructed
 * iterable.
 * If the `source` iterable is revertible, then uses its `reverse()` method to revert the constructed one.
 * Otherwise stores elements to array and reverts them with `reverseArray()` function.
 *
 * @param source  A source iterable.
 *
 * @returns An iterable of the `source` elements in reverse order.
 */
export function reverseIt<T>(source: Iterable<T> | RevertibleIterable<T> | ArrayLike<T>): Iterable<T> {
  if (isArrayLike(source)) {
    return reverseArray(source);
  }
  if (itsRevertible(source)) {

    const reversed = source.reverse();

    return makeIt(() => itsIterator(reversed));
  }
  return reverseArray(Array.from(source));
}

/**
 * Constructs an iterable of array-like structure elements in reverse order.
 *
 * @param array  Source array.
 *
 * @returns An iterable of the `source` elements in reverse order.
 */
export function reverseArray<T>(array: ArrayLike<T>): Iterable<T> {
  return makeIt(
      function* () {

        const len = array.length;

        for (let i = len - 1; i >= 0; --i) {
          yield array[i];
        }
      });
}
