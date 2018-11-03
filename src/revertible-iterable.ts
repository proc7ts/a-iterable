/**
 * An iterable which elements order can be reversed.
 *
 * Arrays implement this interface.
 */
export interface RevertibleIterable<T> extends Iterable<T> {

  /**
   * Constructs an iterable containing this iterable's elements in reverse order.
   *
   * Corresponds to `Array.prototype.reverse()`. Note however, that the array counterpart reverses elements _in place_
   * rather than creating a new array.
   *
   * @return Reversed iterable instance.
   */
  reverse(): Iterable<T>;

}

/**
 * Checks whether the given iterable is revertible.
 *
 * This is always `true` for arrays.
 *
 * @param iterable Iterable to check.
 *
 * @returns `true` if `iterable` has a `reverse` property, or `false` otherwise.
 */
export function itsRevertible<T>(iterable: Iterable<T>): iterable is RevertibleIterable<T> {
  return 'reverse' in iterable;
}

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

    return {
      [Symbol.iterator]() {
        return reversed[Symbol.iterator]();
      },
      reverse() {
        return source;
      },
    };
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
  return {
    *[Symbol.iterator]() {

      const len = array.length;

      for (let i = len - 1; i >= 0; --i) {
        yield array[i];
      }
    },
    reverse() {
      return array;
    }
  };
}
