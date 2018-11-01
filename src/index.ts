/**
 * Abstract `Iterable` implementation with Array-like iteration operations.
 */
export abstract class AIterable<T> implements Iterable<T> {

  /**
   * Checks whether the given iterable implements an `AIterable` interface.
   *
   * @param source An iterable to check.
   *
   * @returns `true` is the `source` has all `AIterable` methods (like `Array` or `AIterable` instance),
   * or `false` otherwise.
   */
  static is<T>(source: Iterable<T>): source is AIterable<T> {
    return 'forEach' in source
        && 'reduce' in source
        && 'filter' in source;
  }

  static of<T>(source: T[]): T[];
  static of<T>(source: Iterable<T>): AIterable<T>;

  /**
   * Creates an `AIterable` instance that iterates over the same items as the given iterable.
   *
   * @param source A source iterable.
   *
   * @return Either `source` itself if it implements `AIterable` already (see `is()` method),
   * or new `AIterable` instance.
   */
  static of<T>(source: Iterable<T>): AIterable<T> {
    if (AIterable.is(source)) {
      return source;
    }

    class IterableWrapper extends AIterable<T> {

      [Symbol.iterator](): Iterator<T> {
        return source[Symbol.iterator]();
      }

    }

    return new IterableWrapper();
  }

  abstract [Symbol.iterator](): Iterator<T>;

  /**
   * Performs the given `action` for each item.
   *
   * Corresponds to `Array.forEach()`.
   *
   * @param action An action to perform on each iterable item. This is a function accepting an item consumer
   * as its only argument.
   */
  forEach(action: (item: T) => void) {
    for (const item of this) {
      action(item);
    }
  }

  /**
   * Applies a function against an accumulator and each item to reduce items to a single value.
   *
   * Corresponds to `Array.reduce()`.
   *
   * @param <R> A type of reduced value.
   * @param reducer A function to apply the value returned from the previous `reducer` call and to each item.
   * @param initialValue Initial value passed to the first `reducer` call.
   *
   * @return Reduced value returned from the last `reducer` call, or `initialValue` if there is no items in this
   * iterable.
   */
  reduce<R>(reducer: (prev: R, item: T) => R, initialValue: R): R {

    let reduced = initialValue;

    for (const item of this) {
      reduced = reducer(reduced, item);
    }

    return reduced;
  }

  /**
   * Creates an iterable with all items that pass the test implemented by the provided function.
   *
   * Corresponds to `Array.filter()`.
   *
   * @param test A function is a predicate, to test each element of the array. Return `true` to keep the item,
   * or `false` otherwise. It accepts the tested item as it only parameter.
   *
   * @return
   */
  filter(test: (item: T) => boolean): AIterable<T> {

    const items = this;

    return AIterable.of({
      *[Symbol.iterator]() {
        for (const item of items) {
          if (test(item)) {
            yield item;
          }
        }
      }
    });
  }

}
