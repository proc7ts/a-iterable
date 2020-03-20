/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { RevertibleIterable } from './revertible-iterable';

/**
 * An iterable with array-like iteration operations. Both `Array` and [[AIterable]] implement it.
 *
 * @typeparam T  A type of elements.
 */
export interface ArrayLikeIterable<T> extends RevertibleIterable<T> {

  /**
   * Determines whether all elements in this iterable satisfy the specified test.
   *
   * @param test  A function that accepts an element as its only parameter. The `every` method calls the
   * `test` function for each element until the `true` returns `false`, or until the end of iterable.
   */
  every(test: (this: void, value: T) => boolean): boolean;

  /**
   * Returns the elements of this iterable that meet the condition specified in a callback function.
   *
   * @param test  A function that accepts an element as its only parameter. The `filter` method calls the
   * `test` function one time for each element.
   */
  filter<S extends T>(test: (this: void, value: T) => value is S): ArrayLikeIterable<S>;

  /**
   * Returns the elements of this iterable that meet the condition specified in a callback function.
   *
   * @param test  A function that accepts an element as its only parameter. The `filter` method calls the
   * `test` function one time for each element.
   */
  filter(test: (this: void, value: T) => boolean): ArrayLikeIterable<T>;

  /**
   * Calls a defined callback function on each element in this iterable. Then, flattens the result.
   *
   * @param map  A function that accepts an element as its only parameter. The `flatMap` method calls the
   * `map` function one time for each element.
   */
  flatMap<U> (map: (this: void, value: T) => ReadonlyArray<U>): ArrayLikeIterable<U>;

  /**
   * Performs the specified action for each element in this iterable.
   *
   * @param action  A function that accepts an element as its only parameter. The `forEach` method calls the
   * `action` function one time for each element.
   */
  forEach(action: (this: void, value: T) => void): void;

  /**
   * Calls a defined callback function on each element in this iterable, and returns an iterable that contains the
   * results.
   *
   * @param map  A function that an element as its only parameter. The `map` method calls the `map`
   * function one time for each element.
   */
  map<U>(map: (this: void, value: T) => U): ArrayLikeIterable<U>;

  /**
   * Calls the specified callback function for all the elements in this iterable. The return value of the callback
   * function is the accumulated result, and is provided as an argument in the next call to the callback function.
   *
   * @param reducer  A function that accepts an accumulated value and an element as its parameters. The `reduce`
   * method calls the `reducer` function one time for each element.
   * @param initialValue  Used as the initial value to start the accumulation. The first call to the `reducer`
   * function provides this value as the first parameter.
   */
  reduce<U>(reducer: (this: void, previousValue: U, currentValue: T) => U, initialValue: U): U;

  /**
   * Returns an iterable containing this iterable's elements in reverse order.
   *
   * This method may reverse the elements _in place_, like arrays do.
   *
   * @return Reversed iterable instance.
   */
  reverse(): ArrayLikeIterable<T>;

  /**
   * Determines whether some element in this iterable satisfies the specified test.
   *
   * @param test  A function that accepts an element as its only parameter. The `some` method calls the
   * `test` function for each element until the `test` returns `true`, or until the end of iterable.
   */
  some(test: (this: void, value: T) => boolean): boolean;

}
