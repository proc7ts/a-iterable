/**
 * A type of elements of iterable.
 *
 * @param <T> An type of iterable.
 */
export type IterableElement<T extends Iterable<any>> = T extends Iterable<infer E> ? E : never;

/**
 * Arbitrary class implementing `Iterable` interface.
 *
 * @param <T> A type of iterable.
 * @param <E> A type of elements to iterate.
 */
export interface IterableClass<T extends Iterable<E>, E = IterableElement<T>> extends Function {
  prototype: T;
  new (...args: any[]): T;
}

/**
 * Checks whether the given value is array-like.
 *
 * @param target A value to check.
 *
 * @returns `true` if the `value` has a `length` property, or `false` otherwise.
 */
export function isArrayLike<T>(target: any): target is ArrayLike<T> {
  return 'length' in target;
}