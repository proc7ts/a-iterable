/**
 * @module a-iterable
 */
import { isArrayLike } from './api';
import { itsRevertible, RevertibleIterable } from './revertible-iterable';
import { itsIterator } from './util';

/**
 * Performs the given `action` for each element of the given `iterable`.
 *
 * @typeparam T  A type of `iterable` elements.
 * @param iterable  An iterable of elements to perform actions on.
 * @param action  An action to perform on each iterable element. This is a function accepting an element as its only
 * parameter.
 */
export function itsEach<T>(iterable: Iterable<T>, action: (element: T) => void) {
  for (const element of iterable) {
    action(element);
  }
}

/**
 * Checks whether the given `iterable` is empty.
 *
 * @param iterable  Iterable to check for elements.
 *
 * @return `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: Iterable<any>): boolean {
  return !!itsIterator(iterable).next().done;
}

/**
 * Tests whether all elements of the given `iterable` pass the test implemented by the provided function.
 *
 * @typeparam T  A type of `iterable` elements.
 * @param iterable  An iterable to test elements of.
 * @param test  A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
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
 * Returns the first element of the given `iterable`.
 *
 * @typeparam T  A type of `iterable` elements.
 * @param iterable  Iterable to extract element from.
 *
 * @return Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: Iterable<T>): T | undefined {
  return itsIterator(iterable).next().value;
}

/**
 * Returns the last element of the given `iterable`.
 *
 * If the given `iterable` is an array-like structure, then just returns its last element. If it is revertible,
 * then extracts the first element of reverted one. Otherwise iterates over elements to find the last one.
 *
 * @typeparam T  A type of `iterable` elements.
 * @param iterable  Iterable to extract element from.
 *
 * @return Either the last element, or `undefined` if the given `iterable` is empty.
 */
export function itsLast<T>(iterable: Iterable<T> | RevertibleIterable<T> | ArrayLike<T>): T | undefined {
  if (isArrayLike(iterable)) {
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

/**
 * Applies a function against an accumulator and each element of the given `iterable` to reduce elements to a single
 * value.
 *
 * @typeparam T  A type of `iterable` elements.
 * @typeparam R  A type of reduced value.
 * @param iterable  An iterable to reduce values of.
 * @param reducer  A function to apply the value returned from the previous `reducer` call and to each element.
 * @param initialValue  Initial value passed to the first `reducer` call.
 *
 * @return Reduced value returned from the last `reducer` call, or `initialValue` if there is no elements in the given
 * `iterable`.
 */
export function itsReduction<T, R>(
    iterable: Iterable<T>,
    reducer: (prev: R, element: T) => R,
    initialValue: R): R {

  let reduced = initialValue;

  for (const element of iterable) {
    reduced = reducer(reduced, element);
  }

  return reduced;
}
