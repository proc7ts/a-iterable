/**
 * @packageDocumentation
 * @module a-iterable
 */
import { RevertibleIterable } from './revertible-iterable';

/**
 * Starts iteration over the given `iterable`.
 *
 * This is a shortcut for `iterable[Symbol.iterator]` to make it friendlier to minification.
 *
 * @param iterable  An iterable to iterate over.
 *
 * @return An iterator.
 */
export function itsIterator<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable[Symbol.iterator]();
}

/**
 * Builds an iterable iterator over the given `iterable`.
 *
 * @param iterable  An iterable to iterate over.
 *
 * @return An iterator.
 */
export function itsIterable<T>(iterable: Iterable<T>): IterableIterator<T> {
  return function *() { yield* iterable; }();
}

/**
 * Creates custom iterable.
 *
 * @param iterate  A no-arg function constructing an iterator.
 * @param reverse  When `undefined` or unspecified the created iterable won't be reversible.
 *
 * @returns New iterable.
 */
export function makeIt<T>(iterate: (this: Iterable<T>) => Iterator<T>, reverse?: undefined): Iterable<T>;

/**
 * Creates custom revertible iterable.
 *
 * @param iterate  A no-arg function constructing an iterator.
 * @param reverse  A no-arg function constructing a reverse iterable.
 *
 * @returns New reversible iterable.
 */
export function makeIt<T>(
    iterate: (this: RevertibleIterable<T>) => Iterator<T>,
    reverse: (this: RevertibleIterable<T>) => Iterable<T>,
): RevertibleIterable<T>;

export function makeIt<T>(
    iterate: (this: RevertibleIterable<T>) => Iterator<T>,
    reverse?: (this: RevertibleIterable<T>) => Iterable<T>,
): Iterable<T> {

  const iterable: Iterable<T> = {
    [Symbol.iterator]: iterate,
  };

  if (!reverse) {
    return iterable;
  }

  const reversible = iterable as RevertibleIterable<T>;

  reversible.reverse = reverse;

  return reversible;
}
