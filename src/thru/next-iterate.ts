/**
 * @packageDocumentation
 * @module @proc7ts/a-iterable
 */
import { NextCall, nextCall } from '@proc7ts/call-thru';
import { IterableCallChain } from './iterable-call-chain';

/**
 * Creates a next call in {@link IterableCallChain iterable call chain} that performs the next passes for each
 * element of the given iterable.
 *
 * This call passes elements to the next call on demand. While the `nextEach()` one transforms them all at once,
 * and iterates over results after that.
 *
 * @param iterable  An iterable containing elements to pass down the chain.
 *
 * @returns Next call for iterable call chain.
 */
export function nextIterate<T>(iterable: Iterable<T>): NextCall<IterableCallChain, [T], T> {
  return nextCall((chain, pass) => chain.iterate(pass, iterable));
}
