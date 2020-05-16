/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { reverseArray } from './reverse';
import { RevertibleIterable } from './revertible-iterable';
import { makeIt } from './util';

/**
 * @internal
 */
function *arrayIterator<T>(array: ArrayLike<T>): Generator<T> {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < array.length; ++i) {
    yield array[i];
  }
}

/**
 * Builds a {@link RevertibleIterable revertible iterable} over elements of array-like structure.
 *
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns A revertible iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): RevertibleIterable<T> {
  return makeIt<T>(() => arrayIterator(array), () => reverseArray(array));
}

/**
 * @internal
 */
const noneIterable: RevertibleIterable<any> = {

  *[Symbol.iterator](): Iterator<any> {/* do not iterate */},

  reverse() { return this; },

};

/**
 * Returns an iterable without elements.
 *
 * @typeparam T  A type of constructed iterable elements.
 *
 * @returns An empty iterable instance revertible to itself.
 */
export function overNone<T>(): RevertibleIterable<T> {
  return noneIterable;
}
