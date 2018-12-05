import { callThru, NextCall, nextEach, PassedThru } from 'call-thru';
import { IterableClass, IterableElement } from './api';
import { ArrayLikeIterable } from './array-like-iterable';
import { reverseArray, reverseIt } from './reverse';
import { RevertibleIterable } from './revertible-iterable';
import { itsEach, itsEvery, itsReduction } from './termination';
import { thruIt } from './thru';
import { filterIt, flatMapIt, mapIt } from './transform';
import { itsIterator, makeIt } from './util';
import Args = NextCall.Callee.Args;
import Last = NextCall.LastOutcome;
import Out = NextCall.Outcome;

const API_METHODS: (keyof ArrayLikeIterable<any>)[] = [
  'every',
  'filter',
  'flatMap',
  'forEach',
  'map',
  'reduce',
  'reverse',
];

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
    return API_METHODS.every(name => name in source);
  }

  /**
   * Creates an `AIterable` instance that iterates over the same elements as the given one if necessary.
   *
   * @param source A source array-like iterable.
   *
   * @return A `source` itself.
   */
  static of<T>(source: ArrayLikeIterable<T>): typeof source;

  /**
   * Creates an `AIterable` instance that iterates over the same elements as the given one if necessary.
   *
   * @param source A source iterable.
   *
   * @return Either `source` itself if it implements `ArrayLikeIterable` already (see `is()` method),
   * or new `AIterable` instance iterating over the `source`.
   */
  static of<T>(source: Iterable<T>): AIterable<T>;

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
    return make(() => source, () => reverseIt(source));
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
  filter(test: (element: T) => boolean): AIterable<T>;

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
  filter<S extends T>(test: (element: T) => element is S): AIterable<S>;

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

    return make(() => reverseArray([...elements]), () => this);
  }

  thru<R1>(
      fn: (this: void, arg: T) => R1):
      AIterable<PassedThru.Item<Last<R1>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2):
      AIterable<PassedThru.Item<Out<R1, Last<R2>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Last<R3>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Last<R4>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Last<R5>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Last<R6>>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Last<R7>>>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7,
      P8 extends Args<R7>, R8>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7,
      fn8: (this: void, ...args: P8) => R8):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Out<R7, Last<R8>>>>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7,
      P8 extends Args<R7>, R8,
      P9 extends Args<R8>, R9>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7,
      fn8: (this: void, ...args: P8) => R8,
      fn9: (this: void, ...args: P9) => R9):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Out<R7, Out<R8, Last<R9>>>>>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7,
      P8 extends Args<R7>, R8,
      P9 extends Args<R8>, R9,
      P10 extends Args<R9>, R10>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7,
      fn8: (this: void, ...args: P8) => R8,
      fn9: (this: void, ...args: P9) => R9,
      fn10: (this: void, ...args: P10) => R10):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Out<R7, Out<R8, Out<R9, Last<R10>>>>>>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7,
      P8 extends Args<R7>, R8,
      P9 extends Args<R8>, R9,
      P10 extends Args<R9>, R10,
      P11 extends Args<R10>, R11>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7,
      fn8: (this: void, ...args: P8) => R8,
      fn9: (this: void, ...args: P9) => R9,
      fn10: (this: void, ...args: P10) => R10,
      fn11: (this: void, ...args: P11) => R11):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
              Last<R11>>>>>>>>>>>>>;

  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7,
      P8 extends Args<R7>, R8,
      P9 extends Args<R8>, R9,
      P10 extends Args<R9>, R10,
      P11 extends Args<R10>, R11,
      P12 extends Args<R11>, R12>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7,
      fn8: (this: void, ...args: P8) => R8,
      fn9: (this: void, ...args: P9) => R9,
      fn10: (this: void, ...args: P10) => R10,
      fn11: (this: void, ...args: P11) => R11,
      fn12: (this: void, ...args: P12) => R12):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
              Out<R11, Last<R12>>>>>>>>>>>>>>;

  /**
   * Passes each element of this iterable trough a chain of transformation passes.
   *
   * The passes are preformed by `callThru()` function.
   *
   * @returns Next iterable of transformed elements.
   */
  thru<
      R1,
      P2 extends Args<R1>, R2,
      P3 extends Args<R2>, R3,
      P4 extends Args<R3>, R4,
      P5 extends Args<R4>, R5,
      P6 extends Args<R5>, R6,
      P7 extends Args<R6>, R7,
      P8 extends Args<R7>, R8,
      P9 extends Args<R8>, R9,
      P10 extends Args<R9>, R10,
      P11 extends Args<R10>, R11,
      P12 extends Args<R11>, R12,
      P13 extends Args<R12>, R13>(
      fn1: (this: void, arg: T) => R1,
      fn2: (this: void, ...args: P2) => R2,
      fn3: (this: void, ...args: P3) => R3,
      fn4: (this: void, ...args: P4) => R4,
      fn5: (this: void, ...args: P5) => R5,
      fn6: (this: void, ...args: P6) => R6,
      fn7: (this: void, ...args: P7) => R7,
      fn8: (this: void, ...args: P8) => R8,
      fn9: (this: void, ...args: P9) => R9,
      fn10: (this: void, ...args: P10) => R10,
      fn11: (this: void, ...args: P11) => R11,
      fn12: (this: void, ...args: P12) => R12,
      fn13: (this: void, ...args: P13) => R13):
      AIterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
          Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
              Out<R11, Out<R12, Last<R13>>>>>>>>>>>>>>>;

  thru<R>(...fns: ((...args: any[]) => any)[]): AIterable<PassedThru.Item<R>> {

    const thru = thruIt as any;

    return make(() => thru(this, ...fns));
  }

}

class None extends AIterable<any> {

  *[Symbol.iterator](): Iterator<any> {}

  reverse() {
    return this;
  }

}

const NONE = new None();

function make<T>(iterate: () => Iterable<T>, reverse?: () => Iterable<T>): AIterable<T> {

  class Iterable extends AIterable<T> {

    [Symbol.iterator]() {
      return itsIterator(iterate());
    }

    reverse(): Iterable {
      if (!reverse) {
        return super.reverse();
      }
      return AIterable.from(makeIt(() => itsIterator(reverse()), () => this));
    }

  }

  return new Iterable();
}

/**
 * Extends an iterable class with `AIterable` API.
 *
 * @param <C> A type of iterable class to extend.
 * @param <E> A type of elements to iterate.
 * @param iterableClass A class to extend.
 *
 * @returns A new class extending original `iterableClass` and implementing the missing `AIterable` methods.
 */
export function toAIterable<C extends IterableClass<any, E>, E = IterableElement<InstanceType<C>>>(
    iterableClass: C):
    C & IterableClass<AIterable<E>, E> {

  class ExtendedIterable extends iterableClass {
  }

  const extended = ExtendedIterable;
  const proto = extended.prototype;

  API_METHODS.forEach(name => {
    if (!(name in proto)) {
      Object.defineProperty(proto, name, {
        configurable: true,
        value: AIterable.prototype[name],
      });
    }
  });

  return extended as C & IterableClass<AIterable<E>, E>;
}
