import { ArrayLikeIterable } from './array-like-iterable';
import { itsRevertible, reverseArray, reverseIt, RevertibleIterable } from './revertible-iterable';
import { itsEach, itsEvery, itsReduction } from './termination';
import { filterIt, flatMapIt, mapIt } from './transform';

/**
 * Abstract `Iterable` implementation with array-like iteration operations.
 *
 * @param <T> A type of elements.
 */
export abstract class AIterable<T> implements ArrayLikeIterable<T> {

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
   * Checks whether the given iterable is an array-like one.
   *
   * @param source An iterable to check.
   *
   * @returns `true` is the `source` has all `ArrayLikeIterable` methods (like `Array` or `AIterable` instance),
   * or `false` otherwise.
   */
  static is<T>(source: Iterable<T>): source is ArrayLikeIterable<T> {
    return 'every' in source
        && 'filter' in source
        && 'flatMap' in source
        && 'forEach' in source
        && 'map' in source
        && 'reduce' in source
        && itsRevertible(source);
  }

  static of<T>(source: ArrayLikeIterable<T>): typeof source;
  static of<T>(source: Iterable<T>): AIterable<T>;

  /**
   * Creates an `AIterable` instance that iterates over the same elements as the given one if necessary.
   *
   * @param source A source iterable.
   *
   * @return Either `source` itself if it implements `ArrayLikeIterable` already (see `is()` method),
   * or new `AIterable` instance iterating over the `source`.
   */
  static of<T>(source: Iterable<T> | RevertibleIterable<T> | T[]): ArrayLikeIterable<T> {
    if (AIterable.is(source)) {
      return source;
    }
    return AIterable.from(source);
  }

  /**
   * Creates an `AIterable` instance that iterates over the same elements as the given one.
   *
   * Uses `reverseIt()` function to reverse the constructed iterable.
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
    return itsEvery(this, test);
  }

  filter(test: (element: T) => boolean): AIterable<T>;
  filter<S extends T>(test: (element: T) => element is S): AIterable<S>;

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
    return make(
        () => filterIt(this, test),
        () => filterIt(this.reverse(), test));
  }

  /**
   * First maps each element using a mapping function, then flattens the result into a new iterable.
   *
   * Corresponds to `Array.prototype.flatMap()`.
   *
   * Note that the overridden `flatMap` method of `ArrayLikeIterable` expects an array to be returned from `convert`
   * callback, while in this method it may return arbitrary iterable.
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
    itsEach(this, action);
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
    return make(
        () => mapIt(this, convert),
        () => mapIt(this.reverse(), convert));
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
    return itsReduction(this, reducer, initialValue);
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
