import { itsRevertible, RevertibleIterable } from './revertible-iterable';
import { itsIterator, makeIt } from './util';

/**
 * Constructs a reversed iterable.
 *
 * If the `source` iterable is an array, then uses `reverseArray()` function to revert the constructed iterable.
 * If the `source` iterable is revertible, then uses its `reverse()` method to revert the constructed one.
 * Otherwise stores elements to array and reverts them with `reverseArray()` function.
 *
 * @param source A source iterable.
 *
 * @returns An iterable of the `source` elements in reverse order. The returned iterable is revertible to the `source`
 * one.
 */
export function reverseIt<T>(source: Iterable<T> | RevertibleIterable<T> | T[]): RevertibleIterable<T> {
  if (Array.isArray(source)) {
    return reverseArray(source);
  }
  if (itsRevertible(source)) {

    const reversed = source.reverse();

    return makeIt(() => itsIterator(reversed), () => source);
  }
  return reverseArray([...source]);
}

/**
 * Constructs an iterable of array elements in reverse order.
 *
 * @param array Source array.
 *
 * @returns Reversed array elements iterable. The returned iterable is revertible to the `source` array.
 */
export function reverseArray<T>(array: T[]): RevertibleIterable<T> {
  return makeIt(
      function* () {

        const len = array.length;

        for (let i = len - 1; i >= 0; --i) {
          yield array[i];
        }
      },
      () => array,
  );
}
