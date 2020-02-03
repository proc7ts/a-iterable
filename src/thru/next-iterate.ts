/**
 * @packageDocumentation
 * @module a-iterable
 */
import { NextCall, nextCall } from 'call-thru';
import { IterableCallChain } from './iterable-call-chain';

/**
 * Creates a next call in {@link IterableCallChain iterable call chain} that performs the next passes for each
 * element of the given iterable.
 *
 * @param iterable  An iterable containing elements to pass to the next passes.
 *
 * @returns Next call for iterable call chain.
 */
export function nextIterate<T>(iterable: Iterable<T>): NextCall<IterableCallChain, [T], T> {
  return nextCall((chain, pass) => chain.iterate(pass, iterable));
}
