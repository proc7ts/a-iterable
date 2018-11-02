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
 * If the given `iterable` is array, the just returns its last item. If it is revertible, then extracts the first
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
