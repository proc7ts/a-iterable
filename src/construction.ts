import { RevertibleIterable } from './revertible-iterable';

const NONE: RevertibleIterable<any> = {

  *[Symbol.iterator](): Iterator<any> {},

  reverse() { return this; }

};

/**
 * Returns an iterable without elements.
 *
 * @returns An empty iterable instance revertible to itself.
 */
export function overNone<T>(): RevertibleIterable<T> {
  return NONE;
}
