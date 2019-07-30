/**
 * @module a-iterable
 */
import { RevertibleIterable } from './revertible-iterable';

/**
 * An iterable with array-like iteration operations. Both `Array` and [[AIterable]] implement it.
 *
 * @typeparam T  A type of elements.
 */
export interface ArrayLikeIterable<T> extends RevertibleIterable<T> {

  /**
   * Determines whether all the element in this iterable satisfy the specified test.
   *
   * @param callbackfn  A function that accepts an element as its only parameter. The `every` method calls the
   * `callbackfn` function for each element until the `callbackfn` returns `false`, or until the end of iterable.
   */
  every(callbackfn: (value: T) => boolean): boolean;

  /**
   * Returns the elements of this iterable that meet the condition specified in a callback function.
   *
   * @param callbackfn  A function that accepts an element as its only parameter. The `filter` method calls the
   * `callbackfn` function one time for each element.
   */
  filter<S extends T>(callbackfn: (value: T) => value is S): ArrayLikeIterable<S>;

  /**
   * Returns the elements of this iterable that meet the condition specified in a callback function.
   *
   * @param callbackfn  A function that accepts an element as its only parameter. The `filter` method calls the
   * `callbackfn` function one time for each element.
   */
  filter(callbackfn: (value: T) => boolean): ArrayLikeIterable<T>;

  /**
   * Calls a defined callback function on each element in this iterable. Then, flattens the result.
   *
   * @param callback  A function that accepts an element as its only parameter. The `flatMap` method calls the
   * `callback` function one time for each element.
   */
  flatMap<U> (callback: (value: T) => ReadonlyArray<U>): ArrayLikeIterable<U>;

  /**
   * Performs the specified action for each element in this iterable.
   *
   * @param callbackfn  A function that accepts an element as its only parameter. The `forEach` method calls the
   * `callbackfn` function one time for each element.
   */
  forEach(callbackfn: (value: T) => void): void;

  /**
   * Calls a defined callback function on each element in this iterable, and returns an iterable that contains the
   * results.
   *
   * @param callbackfn  A function that an element as its only parameter. The `map` method calls the `callbackfn`
   * function one time for each element.
   */
  map<U>(callbackfn: (value: T) => U): ArrayLikeIterable<U>;

  /**
   * Calls the specified callback function for all the elements in this iterable. The return value of the callback
   * function is the accumulated result, and is provided as an argument in the next call to the callback function.
   *
   * @param callbackfn  A function that accepts an accumulated value and an element as its parameters. The `reduce`
   * method calls the `callbackfn` function one time for each element.
   * @param initialValue  Used as the initial value to start the accumulation. The first call to the `callbackfn`
   * function provides this value as the first parameter.
   */
  reduce<U>(callbackfn: (previousValue: U, currentValue: T) => U, initialValue: U): U;

  /**
   * Returns an iterable containing this iterable's elements in reverse order.
   *
   * This method may reverse the elements _in place_, like arrays do.
   *
   * @return Reversed iterable instance.
   */
  reverse(): ArrayLikeIterable<T>;

}
