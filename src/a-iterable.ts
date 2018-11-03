import { itsRevertible, reverseArray, reverseIt, RevertibleIterable } from './revertible-iterable';
import { flatMapIt } from './transform';

/**
 * Abstract `Iterable` implementation with Array-like iteration operations.
 *
 * @param <T> A type of elements.
 */
export abstract class AIterable<T> implements RevertibleIterable<T> {

  /**
   * Returns an iterable without elements.
   *
   * @returns An empty iterable instance.
   */
  static none<T>(): AIterable<T> {
    // tslint:disable:no-use-before-declare
    return NONE;
    // tslint:enable:no-use-before-declare
  }

  /**
   * Checks whether the given iterable implements an `AIterable` interface.
   *
   * @param source An iterable to check.
   *
   * @returns `true` is the `source` has all `AIterable` methods (like `Array` or `AIterable` instance),
   * or `false` otherwise.
   */
  static is<T>(source: Iterable<T> | RevertibleIterable<T>): source is AIterable<T> {
    return 'every' in source
        && 'filter' in source
        && 'flatMap' in source
        && 'forEach' in source
        && 'map' in source
        && 'reduce' in source
        && itsRevertible(source);
  }

  static of<T>(source: T[]): T[];
  static of<T>(source: Iterable<T>): AIterable<T>;

  /**
   * Creates an `AIterable` instance that iterates over the same elements as the given one.
   *
   * @param source A source iterable.
   *
   * @return Either `source` itself if it implements `AIterable` already (see `is()` method),
   * or new `AIterable` instance.
   */
  static of<T>(source: Iterable<T> | RevertibleIterable<T> | T[]): AIterable<T> | T[] {
    if (AIterable.is(source)) {
      return source;
    }
    return AIterable.from(source);
  }

  /**
   * Creates an `AIterable` instance that iterates over the same elements as the given one.
   *
   * Uses `reverseIt()` function to revert the constructed iterable.
   *
   * @param source A source iterable.
   *
   * @return Always new `AIterable` instance.
   */
  static from<T>(source: Iterable<T> | RevertibleIterable<T> | T[]): AIterable<T> {

    class IterableWrapper extends AIterable<T> {

      [Symbol.iterator](): Iterator<T> {
        return source[Symbol.iterator]();
      }

      reverse() {
        return AIterable.from(reverseIt(source));
      }

    }

    return new IterableWrapper();
  }

  abstract [Symbol.iterator](): Iterator<T>;

  /**
   * Tests whether all elements pass the test implemented by the provided function.
   *
   * Corresponds to `Array.prototype.every()`.
   *
   * @param test A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
   * and return `false` from the method call. It accepts the tested element as the only parameter.
   *
   * @returns `true` if the `test` function returned a truthy value for every element, or `false` otherwise.
   * Returns `true` for empty iterable.
   */
  every(test: (element: T) => boolean): boolean {
    for (const element of this) {
      if (!test(element)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates an iterable with all elements that pass the test implemented by the provided function.
   *
   * Corresponds to `Array.prototype.filter()`.
   *
   * @param test A predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
   * It accepts the tested element as the only parameter.
   *
   * @return A new iterable with the elements that pass the test. If no elements passed the test, an empty iterable will
   * be returned.
   */
  filter(test: (element: T) => boolean): AIterable<T> {

    const elements = this;

    return AIterable.of({
      *[Symbol.iterator]() {
        for (const element of elements) {
          if (test(element)) {
            yield element;
          }
        }
      }
    });
  }

  /**
   * First maps each element using a mapping function, then flattens the result into a new iterable.
   *
   * Corresponds to `Array.prototype.flatMap()`.
   *
   * @param <R> A type of converted elements.
   * @param convert A function that produces a new iterable, taking the source element as the only parameter.
   *
   * @returns A new iterable with each element being the flattened result of the `convert` function call.
   */
  flatMap<R>(convert: (element: T) => Iterable<R>): AIterable<R> {
    return make(
        () => flatMapIt(this, convert),
        () => flatMapIt(this.reverse(), element => reverseIt(convert(element))));
  }

  /**
   * Performs the given `action` for each element.
   *
   * Corresponds to `Array.prototype.forEach()`.
   *
   * @param action An action to perform on each iterable element. This is a function accepting an element as its only
   * parameter.
   */
  forEach(action: (element: T) => void) {
    for (const element of this) {
      action(element);
    }
  }

  /**
   * Creates a new iterable with the results of calling a provided function on every element.
   *
   * Corresponds to `Array.prototype.map()`.
   *
   * @param <R> A type of converted elements.
   * @param convert A function that produces an element of the new iterable, taking the source element as the only
   * parameter.
   *
   * @return A new iterable with each element being the result of the `convert` function call.
   */
  map<R>(convert: (element: T) => R): AIterable<R> {

    const elements = this;

    return AIterable.of({
      *[Symbol.iterator]() {
        for (const element of elements) {
          yield convert(element);
        }
      }
    });
  }

  /**
   * Applies a function against an accumulator and each element to reduce elements to a single value.
   *
   * Corresponds to `Array.prototype.reduce()`.
   *
   * @param <R> A type of reduced value.
   * @param reducer A function to apply the value returned from the previous `reducer` call and to each element.
   * @param initialValue Initial value passed to the first `reducer` call.
   *
   * @return Reduced value returned from the last `reducer` call, or `initialValue` if there is no elements in this
   * iterable.
   */
  reduce<R>(reducer: (prev: R, element: T) => R, initialValue: R): R {

    let reduced = initialValue;

    for (const element of this) {
      reduced = reducer(reduced, element);
    }

    return reduced;
  }

  /**
   * Constructs an iterable containing this iterable's elements in reverse order.
   *
   * By default this method converts iterable to array and then reverts its elements with `reverseArray()` function.
   *
   * @return Reversed iterable instance.
   */
  reverse(): AIterable<T> {

    const elements = this;

    return AIterable.from({
      [Symbol.iterator] () {
        return reverseArray([...elements])[Symbol.iterator]();
      }
    });
  }

}

class NoneIterable extends AIterable<any> {

  *[Symbol.iterator](): Iterator<any> {}

  reverse() {
    return this;
  }

}

const NONE = new NoneIterable();

function make<T>(iterate: () => Iterable<T>, reverse: () => Iterable<T>): AIterable<T> {

  class Result extends AIterable<T> {

    [Symbol.iterator]() {
      return iterate()[Symbol.iterator]();
    }

    reverse() {
      return AIterable.from({
        [Symbol.iterator]() {
          return reverse()[Symbol.iterator]();
        }
      });
    }

  }

  return new Result();
}
