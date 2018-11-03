/**
 * First maps each element of the `source` iterable using a mapping function, then flattens the result into a new
 * iterable.
 *
 * @param <T> A type of source elements.
 * @param <R> A type of converted elements.
 * @param source A source iterable.
 * @param convert A function that produces a new iterable, taking the source element as the only parameter.
 *
 * @returns A new iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIt<T, R>(source: Iterable<T>, convert: (element: T) => Iterable<R>): Iterable<R> {
  return {
    *[Symbol.iterator]() {
      for (const element of source) {
        yield *convert(element);
      }
    }
  };
}

/**
 * Creates a new iterable with the results of calling a provided function on every element of the `source` one.
 *
 * @param <T> A type of source elements.
 * @param <R> A type of converted elements.
 * @param source A source iterable.
 * @param convert A function that produces an element of the new iterable, taking the source element as the only
 * parameter.
 */
export function mapIt<T, R>(source: Iterable<T>, convert: (element: T) => R): Iterable<R> {
  return {
    *[Symbol.iterator]() {
      for (const element of source) {
        yield convert(element);
      }
    }
  };
}
