import { RevertibleIterable } from './revertible-iterable';

/**
 * Builds an iterable over elements of array-like structure.
 *
 * @param array An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns A revertible iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): RevertibleIterable<T> {
  return {

    *[Symbol.iterator]() {
      for (let i = 0; i < array.length; ++i) {
        yield array[i];
      }
    },

    reverse() {
      return {
        *[Symbol.iterator]() {
          for (let i = array.length - 1; i >= 0; --i) {
            yield array[i];
          }
        }
      };

    },
  };
}

const NONE: RevertibleIterable<any> = {

  *[Symbol.iterator](): Iterator<any> {},

  reverse() { return this; }

};

/**
 * Returns an iterable without elements.
 *
 * @param <T> A type of constructed iterable elements.
 *
 * @returns An empty iterable instance revertible to itself.
 */
export function overNone<T>(): RevertibleIterable<T> {
  return NONE;
}
