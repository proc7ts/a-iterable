/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { IterableClass, IterableElement } from './api';
import { ArrayLikeIterable } from './array-like-iterable';
import { reverseArray, reverseIt } from './reverse';
import { RevertibleIterable } from './revertible-iterable';
import { itsEach, itsEvery, itsReduction, itsSome } from './termination';
import { IterableCallChain, thruIt } from './thru';
import { filterIt, flatMapIt, mapIt } from './transform';
import { itsIterator, makeIt } from './util';
/** @hidden */
import Args = IterableCallChain.Args;
/** @hidden */
import Out = IterableCallChain.Out;

/**
 * @internal
 */
const ArrayLikeIterableMethods: (keyof ArrayLikeIterable<any>)[] = [
  'every',
  'filter',
  'flatMap',
  'forEach',
  'map',
  'reduce',
  'reverse',
  'some',
];

/**
 * Abstract `Iterable` implementation with array-like iteration operations.
 *
 * @typeparam T  A type of elements.
 */
export abstract class AIterable<T> implements ArrayLikeIterable<T> {

  /**
   * Returns an iterable without elements.
   *
   * @returns An empty iterable instance.
   */
  static none<T>(): AIterable<T> {
    return noneAIterable; // eslint-disable-line @typescript-eslint/no-use-before-define
  }

  /**
   * Checks whether the given iterable is an array-like one.
   *
   * @param source  An iterable to check.
   *
   * @returns `true` is the `source` has all `ArrayLikeIterable` methods (like `Array` or `AIterable` instance),
   * or `false` otherwise.
   */
  static is<T>(source: Iterable<T>): source is ArrayLikeIterable<T> {
    return ArrayLikeIterableMethods.every(name => name in source);
  }

  /**
   * Creates an [[AIterable]] instance that iterates over the same elements as the given one if necessary.
   *
   * @param source  A source array-like iterable.
   *
   * @return A `source` itself.
   */
  static of<T>(source: ArrayLikeIterable<T>): typeof source;

  /**
   * Creates an [[AIterable]] instance that iterates over the same elements as the given one if necessary.
   *
   * @param source  A source iterable.
   *
   * @return Either `source` itself if it implements `ArrayLikeIterable` already (see `is()` method),
   * or new [[AIterable]] instance iterating over the `source`.
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
   * Uses [[reverseIt]] function to reverse the constructed iterable.
   *
   * @param source  A source iterable.
   *
   * @return Always new `AIterable` instance.
   */
  static from<T>(source: Iterable<T> | RevertibleIterable<T> | readonly T[]): AIterable<T> {
    return makeAIterable(() => source, () => reverseIt(source));
  }

  abstract [Symbol.iterator](): Iterator<T>;

  /**
   * Tests whether all elements pass the test implemented by the provided function.
   *
   * Corresponds to `Array.prototype.every()`.
   *
   * @param test  A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
   * and return `false` from the method call. It accepts the tested element as the only parameter.
   *
   * @returns `true` if the `test` function returned a truthy value for every element, or `false` otherwise.
   * Returns `true` for empty iterable.
   */
  every(test: (this: void, element: T) => boolean): boolean {
    return itsEvery(this, test);
  }

  /**
   * Creates an iterable with all elements that pass the test implemented by the provided function.
   *
   * Corresponds to `Array.prototype.filter()`.
   *
   * @param test  A predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
   * It accepts the tested element as the only parameter.
   *
   * @return A new [[AIterable]] with the elements that pass the test. If no elements passed the test, an empty iterable
   * will be returned.
   */
  filter(test: (this: void, element: T) => boolean): AIterable<T>;

  /**
   * Creates an iterable with all elements extending the given type.
   *
   * Corresponds to `Array.prototype.filter()`.
   *
   * @typeparam R  Target type.
   * @param test  A predicate function to test that element extends the type R. Returns `true` to keep the element, or
   * `false` otherwise. It accepts the tested element as the only parameter.
   *
   * @return A new [[AIterable]] with the elements that pass the test. If no elements passed the test, an empty iterable
   * will be returned.
   */
  filter<R extends T>(test: (this: void, element: T) => element is R): AIterable<R>;

  filter(test: (this: void, element: T) => boolean): AIterable<T> {
    return makeAIterable(
        () => filterIt(this, test),
        () => filterIt(this.reverse(), test),
    );
  }

  /**
   * First maps each element using a mapping function, then flattens the result into a new iterable.
   *
   * Corresponds to `Array.prototype.flatMap()`.
   *
   * Note that the overridden `flatMap` method of `ArrayLikeIterable` expects an array to be returned from `convert`
   * callback, while in this method it may return arbitrary iterable.
   *
   * @typeparam R  A type of converted elements.
   * @param convert  A function that produces a new iterable, taking the source element as the only parameter.
   *
   * @returns A new [[AIterable]] with each element being the flattened result of the `convert` function call.
   */
  flatMap<R>(convert: (this: void, element: T) => Iterable<R>): AIterable<R> {
    return makeAIterable(
        () => flatMapIt(this, convert),
        () => flatMapIt(this.reverse(), element => reverseIt(convert(element))),
    );
  }

  /**
   * Performs the given `action` for each element.
   *
   * Corresponds to `Array.prototype.forEach()`.
   *
   * @param action  An action to perform on each iterable element. This is a function accepting an element as its only
   * parameter.
   */
  forEach(action: (this: void, element: T) => void): void {
    itsEach(this, action);
  }

  /**
   * Creates a new iterable with the results of calling a provided function on every element.
   *
   * Corresponds to `Array.prototype.map()`.
   *
   * @typeparam R  A type of converted elements.
   * @param convert  A function that produces an element of the new iterable, taking the source element as the only
   * parameter.
   *
   * @return A new [[AIterable]] with each element being the result of the `convert` function call.
   */
  map<R>(convert: (this: void, element: T) => R): AIterable<R> {
    return makeAIterable(
        () => mapIt(this, convert),
        () => mapIt(this.reverse(), convert),
    );
  }

  /**
   * Applies a function against an accumulator and each element to reduce elements to a single value.
   *
   * Corresponds to `Array.prototype.reduce()`.
   *
   * @typeparam R  A type of reduced value.
   * @param reducer  A function to apply the value returned from the previous `reducer` call and to each element.
   * @param initialValue  Initial value passed to the first `reducer` call.
   *
   * @return Reduced value returned from the last `reducer` call, or `initialValue` if there is no elements in this
   * iterable.
   */
  reduce<R>(reducer: (this: void, prev: R, element: T) => R, initialValue: R): R {
    return itsReduction(this, reducer, initialValue);
  }

  /**
   * Constructs an iterable containing this iterable's elements in reverse order.
   *
   * By default this method converts iterable to array and then reverts its elements with [[reverseArray]] function.
   *
   * @return Reversed [[AIterable]] instance.
   */
  reverse(): AIterable<T> {
    return makeAIterable(() => reverseArray(Array.from(this)), () => this);
  }

  /**
   * Tests whether some element passed the test implemented by the provided function.
   *
   * Corresponds to `Array.prototype.some()`.
   *
   * @param test  A predicate function to test each element. Returns `false` to continue tests, or `true` to stop it
   * and return `true` from the method call. It accepts the tested element as the only parameter.
   *
   * @returns `true` if the `test` function returned a truthy value for some element, or `false` otherwise.
   * Returns `false` for empty iterable.
   */
  some(test: (this: void, element: T) => boolean): boolean {
    return itsSome(this, test);
  }

  /**
   * Passes each element of this iterable trough a chain of transformation passes.
   *
   * The passes are preformed by `@proc7ts/call-thru` library.
   *
   * @returns Next iterable of transformed elements.
   */
  thru<
      Return1,
      >(
      pass1: (this: void, arg: T) => Return1,
  ): AIterable<Out<Return1>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
  ): AIterable<Out<Return2>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      Args8 extends Args<Return7>, Return8,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
      pass8: (this: void, ...args: Args8) => Return8,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      Args8 extends Args<Return7>, Return8,
      Args9 extends Args<Return8>, Return9,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
      pass8: (this: void, ...args: Args8) => Return8,
      pass9: (this: void, ...args: Args9) => Return9,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      Args8 extends Args<Return7>, Return8,
      Args9 extends Args<Return8>, Return9,
      Args10 extends Args<Return9>, Return10,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
      pass8: (this: void, ...args: Args8) => Return8,
      pass9: (this: void, ...args: Args9) => Return9,
      pass10: (this: void, ...args: Args10) => Return10,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      Args8 extends Args<Return7>, Return8,
      Args9 extends Args<Return8>, Return9,
      Args10 extends Args<Return9>, Return10,
      Args11 extends Args<Return10>, Return11,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
      pass8: (this: void, ...args: Args8) => Return8,
      pass9: (this: void, ...args: Args9) => Return9,
      pass10: (this: void, ...args: Args10) => Return10,
      pass11: (this: void, ...args: Args11) => Return11,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      Args8 extends Args<Return7>, Return8,
      Args9 extends Args<Return8>, Return9,
      Args10 extends Args<Return9>, Return10,
      Args11 extends Args<Return10>, Return11,
      Args12 extends Args<Return11>, Return12,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
      pass8: (this: void, ...args: Args8) => Return8,
      pass9: (this: void, ...args: Args9) => Return9,
      pass10: (this: void, ...args: Args10) => Return10,
      pass11: (this: void, ...args: Args11) => Return11,
      pass12: (this: void, ...args: Args12) => Return12,
  ): AIterable<Out<Return3>>;

  thru<
      Return1,
      Args2 extends Args<Return1>, Return2,
      Args3 extends Args<Return2>, Return3,
      Args4 extends Args<Return3>, Return4,
      Args5 extends Args<Return4>, Return5,
      Args6 extends Args<Return5>, Return6,
      Args7 extends Args<Return6>, Return7,
      Args8 extends Args<Return7>, Return8,
      Args9 extends Args<Return8>, Return9,
      Args10 extends Args<Return9>, Return10,
      Args11 extends Args<Return10>, Return11,
      Args12 extends Args<Return11>, Return12,
      Args13 extends Args<Return12>, Return13,
      >(
      pass1: (this: void, arg: T) => Return1,
      pass2: (this: void, ...args: Args2) => Return2,
      pass3: (this: void, ...args: Args3) => Return3,
      pass4: (this: void, ...args: Args4) => Return4,
      pass5: (this: void, ...args: Args5) => Return5,
      pass6: (this: void, ...args: Args6) => Return6,
      pass7: (this: void, ...args: Args7) => Return7,
      pass8: (this: void, ...args: Args8) => Return8,
      pass9: (this: void, ...args: Args9) => Return9,
      pass10: (this: void, ...args: Args10) => Return10,
      pass11: (this: void, ...args: Args11) => Return11,
      pass12: (this: void, ...args: Args12) => Return12,
      pass13: (this: void, ...args: Args13) => Return13,
  ): AIterable<Out<Return3>>;

  thru<R>(...fns: ((...args: any[]) => any)[]): AIterable<R> {

    const thru = thruIt as (it: Iterable<T>, ...fns: ((...args: any[]) => any)[]) => Iterable<R>;

    return makeAIterable(() => thru(this, ...fns));
  }

}

/**
 * @internal
 */
class NoneAIterable extends AIterable<any> {

  *[Symbol.iterator](): Iterator<any> {/* Generate nothing */}

  reverse(): this {
    return this;
  }

}

/**
 * @internal
 */
const noneAIterable = (/*#__PURE__*/ new NoneAIterable());

/**
 * @internal
 */
function makeAIterable<T>(
    iterate: (this: void) => Iterable<T>,
    reverse?: (this: void) => Iterable<T>,
): AIterable<T> {

  class Iterable extends AIterable<T> {

    [Symbol.iterator](): Iterator<T> {
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
 * @typeparam C  A type of iterable class to extend.
 * @typeparam E  A type of elements to iterate.
 * @param iterableClass  A class to extend.
 *
 * @returns A new class extending original `iterableClass` and implementing the missing [[AIterable]] methods.
 */
export function toAIterable<C extends IterableClass<Iterable<E>, E>, E = IterableElement<InstanceType<C>>>(
    iterableClass: C,
): C & IterableClass<AIterable<E>, E> {

  class ExtendedIterable extends iterableClass {
  }

  const extended = ExtendedIterable;
  const proto = extended.prototype;

  ArrayLikeIterableMethods.forEach(name => {
    if (!(name in proto)) {
      Object.defineProperty(proto, name, {
        configurable: true,
        value: AIterable.prototype[name],
      });
    }
  });

  return extended as C & IterableClass<AIterable<E>, E>;
}
