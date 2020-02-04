/**
 * @packageDocumentation
 * @module a-iterable
 */
import { CallChain, NextCall, NextSkip } from 'call-thru';

/**
 * A call chain transforming elements of iterable.
 *
 * Transformations performed when transformed element requested from final iterable.
 */
export interface IterableCallChain extends CallChain {

  /**
   * Calls a pass in this chain with each element of the given iterable.
   *
   * @typeparam Item  A type of element of iterable.
   * @param pass  A pass to call.
   * @param iterable  Source iterable.
   */
  iterate<Item>(pass: (this: void, arg: Item) => any, iterable: Iterable<Item>): void;

}

export namespace IterableCallChain {

  export type Args<Return> = Return extends NextSkip<any>
      ? never
      : (Return extends (NextCall<IterableCallChain, infer A, any>)
          ? A
          : [Return]);

  export type Out<Return> = Return extends NextSkip<any>
      ? never
      : (Return extends NextCall<IterableCallChain, any, infer A>
          ? A
          : Return);

}
