import { itsRevertible, RevertibleIterable } from './revertible-iterable';

/**
 * Checks whether the given iterable is empty.
 *
 * @param iterable Iterable to check for elements.
 *
 * @return `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: Iterable<any>): boolean {
  return iterable[Symbol.iterator]().next().done;
}

/**
 * Tests whether all elements of the given `iterable` pass the test implemented by the provided function.
 *
 * @param iterable An iterable to test elements of.
 * @param test A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
 * and return `false` from the method call. It accepts the tested element as the only parameter.
 *
 * @returns `true` if the `test` function returned a truthy value for every element, or `false` otherwise.
 * Returns `true` for empty iterable.
 */
export function itsEvery<T>(iterable: Iterable<T>, test: (element: T) => boolean): boolean {
  for (const element of iterable) {
    if (!test(element)) {
      return false;
    }
  }
  return true;
}

/**
 * Returns the first element of the given iterable.
 *
 * @param iterable Iterable to extract element from.
 *
 * @return Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: Iterable<T>): T | undefined {
  return iterable[Symbol.iterator]().next().value;
}

/**
 * Returns the last element of the given iterable.
 *
 * If the given `iterable` is an array, then just returns its last element. If it is revertible, then extracts the first
 * element of reverted iterable. Otherwise iterates over elements to find the last one.
 *
 * @param iterable Iterable to extract element from.
 *
 * @return Either the last element, or `undefined` if the given `iterable` is empty.
 */
export function itsLast<T>(iterable: Iterable<T> | RevertibleIterable<T> | T[]): T | undefined {
  if (Array.isArray(iterable)) {
    return iterable[iterable.length - 1];
  }
  if (itsRevertible(iterable)) {
    return itsFirst(iterable.reverse());
  }

  let last: T | undefined;

  for (const element of iterable) {
    last = element;
  }

  return last;
}
