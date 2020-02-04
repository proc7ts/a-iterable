/**
 * @packageDocumentation
 * @module a-iterable
 */
import { CallChain, NextCall, NextSkip } from 'call-thru';

export interface IterableCallChain extends CallChain {

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
