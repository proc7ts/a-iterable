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
