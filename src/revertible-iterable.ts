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
 * Constructs an iterable of array elements in reverse order.
 *
 * @param array Source array.
 *
 * @returns Reversed array elements iterable.
 */
export function reverseArray<T>(array: T[]): Iterable<T> {
  return {
    *[Symbol.iterator]() {

      const len = array.length;

      for (let i = len - 1; i >= 0; --i) {
        yield array[i];
      }
    }
  };
}
