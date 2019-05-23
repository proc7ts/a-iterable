import { makeIt } from './util';

/**
 * Creates an iterable with all `source` iterable elements that pass the test implemented by the provided function.
 *
 * @typeparam T A type of source elements.
 * @param source A source iterable.
 * @param test A predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
 * It accepts the tested element as the only parameter.
 *
 * @return A new iterable with the elements that pass the test. If no elements passed the test, an empty iterable will
 * be returned.
 */
export function filterIt<T>(source: Iterable<T>, test: (element: T) => boolean): Iterable<T>;

/**
 * Creates an iterable with all `source` iterable elements extending the given type.
 *
 * @typeparam T A type of source elements
 * @typeparam R Target type.
 * @param source A source iterable.
 * @param test A predicate function to test that element extends the type `R`. Returns `true` to keep the element, or
 * `false` otherwise. It accepts the tested element as the only parameter.
 *
 * @return A new iterable with the elements that pass the test. If no elements passed the test, an empty iterable will
 * be returned.
 */
export function filterIt<T, R extends T>(source: Iterable<T>, test: (element: T) => element is R): Iterable<R>;

export function filterIt<T>(source: Iterable<T>, test: (element: T) => boolean): Iterable<T> {
  return makeIt(function* () {
    for (const element of source) {
      if (test(element)) {
        yield element;
      }
    }
  });
}

/**
 * First maps each element of the `source` iterable using a mapping function, then flattens the result into a new
 * iterable.
 *
 * @typeparam T A type of source elements.
 * @typeparam R A type of converted elements.
 * @param source A source iterable.
 * @param convert A function that produces a new iterable, taking the source element as the only parameter.
 *
 * @returns A new iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIt<T, R>(source: Iterable<T>, convert: (element: T) => Iterable<R>): Iterable<R> {
  return makeIt(function* () {
    for (const element of source) {
      yield* convert(element);
    }
  });
}

/**
 * Creates a new iterable with the results of calling a provided function on every element of the `source` one.
 *
 * @typeparam T A type of source elements.
 * @typeparam R A type of converted elements.
 * @param source A source iterable.
 * @param convert A function that produces an element of the new iterable, taking the source element as the only
 * parameter.
 */
export function mapIt<T, R>(source: Iterable<T>, convert: (element: T) => R): Iterable<R> {
  return makeIt(function* () {
    for (const element of source) {
      yield convert(element);
    }
  });
}
