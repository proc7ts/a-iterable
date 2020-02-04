/**
 * @packageDocumentation
 * @module a-iterable
 */
import { asis, isNextCall, NextCall__symbol, noop } from 'call-thru';
import { flatMapIt } from '../transform';
import { IterableCallChain } from './iterable-call-chain';
import Args = IterableCallChain.Args;
import Out = IterableCallChain.Out;

/**
 * Passes each element of the given iterable trough the {@link IterableCallChain chain of transformation passes}.
 *
 * The passes are preformed by `call-thru`.
 *
 * @returns An iterable of transformed elements.
 */
export function thruIt<T, Return1>(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
): Iterable<Out<Return1>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2>(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
): Iterable<Out<Return2>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3>(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
): Iterable<Out<Return3>>;

export function thruIt<T>(
    it: Iterable<T>,
    ...passes: ((...args: any[]) => any)[]
): Iterable<any> {

  let result: Iterable<any>[] = [];
  const chain = (index: number): IterableCallChain => {

    const lastPass = index >= passes.length;

    ++index;

    const pass = index < passes.length ? passes[index] : noop;
    const handleResult = (callResult: any, arg: any): void => {
      if (isNextCall(callResult)) {
        callResult[NextCall__symbol](chain(index), pass);
      } else if (lastPass) {
        result.push([arg]);
      } else {
        chain(index).pass(pass, callResult);
      }
    };

    return ({
      call<A extends any[]>(fn: (...args: A) => any, args: A): void {
        handleResult(fn(...args), args);
      },
      pass<A>(fn: (arg: A) => any, arg: A): void {
        handleResult(fn(arg), arg);
      },
      skip() {/* skip item */},
      iterate<I>(fn: (this: void, arg: I) => void, iterable: Iterable<I>): void {
        result.push({
          *[Symbol.iterator]() {
            for (const item of iterable) {

              const oldResult = result;
              const newResult: Iterable<any>[] = [];

              try {
                result = newResult;
                handleResult(fn(item), item);
              } finally {
                result = oldResult;
              }

              for (const res of newResult) {
                yield* res;
              }
            }
          },
        });
      },
    });
  };

  chain(0).iterate(passes[0], it);

  return flatMapIt(result, asis);
}
