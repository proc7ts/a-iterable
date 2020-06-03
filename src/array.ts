/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { RevertibleIterable } from './revertible-iterable';
import { makeIt } from './util';

/**
 * @internal
 */
function arrayIterator<T>(array: ArrayLike<T>): Iterator<T> {

  let i = 0;

  return {
    next(): IteratorResult<T> {
      if (i < array.length) {
        return { value: array[i++] };
      }

      return { done: true } as IteratorReturnResult<any>;
    },
  };
}

/**
 * @internal
 */
function reverseArrayIterator<T>(array: ArrayLike<T>): Iterator<T> {

  let i = array.length - 1;

  return {
    next(): IteratorResult<T> {
      if (i < 0) {
        return { done: true } as IteratorReturnResult<any>;
      }
      return { value: array[i--] };
    },
  };
}

/**
 * Builds a {@link RevertibleIterable revertible iterable} over elements of array-like structure.
 *
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns A revertible iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): RevertibleIterable<T> {
  return makeIt<T>(
      () => arrayIterator(array),
      () => reverseArray(array),
  );
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
      () => reverseArrayIterator(array),
      () => overArray(array),
  );
}
