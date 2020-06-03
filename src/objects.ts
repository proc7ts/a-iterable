/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { overArray } from './array';
import { RevertibleIterable } from './revertible-iterable';
import { mapIt } from './transform';
import { itsIterator, makeIt } from './util';

/**
 * Builds an iterable over the keys of the given object.
 *
 * A list of keys is constructed using `Reflect.ownKeys()`.
 *
 * @param target  An object to select keys from.
 */
export function overKeys<T extends object>(target: T): RevertibleIterable<keyof T> {
  return overArray(Reflect.ownKeys(target) as (keyof T)[]);
}

/**
 * Object property entry. This is a tuple consisting of property key and value.
 */
export type ObjectEntry<T, K extends keyof T = keyof T> = [K, T[K]];

/**
 * Builds an iterable over the key/value entries of the given object.
 *
 * A list of keys is constructed using `Reflect.ownKeys()`.
 *
 * @param target  An object to select keys and values from.
 */
export function overEntries<T extends object>(target: T): RevertibleIterable<ObjectEntry<T>> {

  const keys = overKeys(target);

  function mapToEntries(_keys: Iterable<keyof T>): Iterable<ObjectEntry<T>> {
    return mapIt(_keys, key => [key, target[key]] as ObjectEntry<T>);
  }

  return makeIt(() => itsIterator(mapToEntries(keys)), () => mapToEntries(keys.reverse()));
}
