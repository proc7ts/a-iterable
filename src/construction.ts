/**
 * @module a-iterable
 */
import { reverseArray } from './reverse';
import { RevertibleIterable } from './revertible-iterable';
import { makeIt } from './util';

/**
 * Builds an iterable over elements of array-like structure.
 *
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns A revertible iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): RevertibleIterable<T> {
  return makeIt<T>(
      function* () {
        for (let i = 0; i < array.length; ++i) {
          yield array[i];
        }
      },
      () => reverseArray(array));
}

const NONE: RevertibleIterable<any> = {

  *[Symbol.iterator](): Iterator<any> {},

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
  return NONE;
}
