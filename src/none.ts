/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { valueProvider } from '@proc7ts/primitives';
import { RevertibleIterable } from './revertible-iterable';

/**
 * @internal
 */
const noneIterator: Iterator<unknown> = {
  next: (/*#__PURE__*/ valueProvider({ done: true } as IteratorReturnResult<unknown>)),
};

/**
 * @internal
 */
const noneIterable: RevertibleIterable<unknown> = {

  [Symbol.iterator]: (/*#__PURE__*/ valueProvider(noneIterator)),

  reverse() { return this; },

};

/**
 * Returns an iterable without elements.
 *
 * @typeparam T  A type of constructed iterable elements.
 *
 * @returns An empty iterable instance revertible to itself.
 */
export function overNone<T>(): RevertibleIterable<T> {
  return noneIterable as RevertibleIterable<T>;
}
