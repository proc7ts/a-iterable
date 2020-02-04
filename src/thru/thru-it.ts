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
export function thruIt<
    T, Return1
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
): Iterable<Out<Return1>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
): Iterable<Out<Return2>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
): Iterable<Out<Return3>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    Args4 extends Args<Return3>, Return4,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
    pass4: (this: void, ...args: Args4) => Return4,
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    Args4 extends Args<Return3>, Return4,
    Args5 extends Args<Return4>, Return5,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
    pass4: (this: void, ...args: Args4) => Return4,
    pass5: (this: void, ...args: Args5) => Return5,
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    Args4 extends Args<Return3>, Return4,
    Args5 extends Args<Return4>, Return5,
    Args6 extends Args<Return5>, Return6,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
    pass4: (this: void, ...args: Args4) => Return4,
    pass5: (this: void, ...args: Args5) => Return5,
    pass6: (this: void, ...args: Args6) => Return6,
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    Args4 extends Args<Return3>, Return4,
    Args5 extends Args<Return4>, Return5,
    Args6 extends Args<Return5>, Return6,
    Args7 extends Args<Return6>, Return7,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
    pass4: (this: void, ...args: Args4) => Return4,
    pass5: (this: void, ...args: Args5) => Return5,
    pass6: (this: void, ...args: Args6) => Return6,
    pass7: (this: void, ...args: Args7) => Return7,
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    Args4 extends Args<Return3>, Return4,
    Args5 extends Args<Return4>, Return5,
    Args6 extends Args<Return5>, Return6,
    Args7 extends Args<Return6>, Return7,
    Args8 extends Args<Return7>, Return8,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
    pass4: (this: void, ...args: Args4) => Return4,
    pass5: (this: void, ...args: Args5) => Return5,
    pass6: (this: void, ...args: Args6) => Return6,
    pass7: (this: void, ...args: Args7) => Return7,
    pass8: (this: void, ...args: Args8) => Return8,
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
    Args2 extends Args<Return1>, Return2,
    Args3 extends Args<Return2>, Return3,
    Args4 extends Args<Return3>, Return4,
    Args5 extends Args<Return4>, Return5,
    Args6 extends Args<Return5>, Return6,
    Args7 extends Args<Return6>, Return7,
    Args8 extends Args<Return7>, Return8,
    Args9 extends Args<Return8>, Return9,
    >(
    it: Iterable<T>,
    pass1: (this: void, arg: T) => Return1,
    pass2: (this: void, ...args: Args2) => Return2,
    pass3: (this: void, ...args: Args3) => Return3,
    pass4: (this: void, ...args: Args4) => Return4,
    pass5: (this: void, ...args: Args5) => Return5,
    pass6: (this: void, ...args: Args6) => Return6,
    pass7: (this: void, ...args: Args7) => Return7,
    pass8: (this: void, ...args: Args8) => Return8,
    pass9: (this: void, ...args: Args9) => Return9,
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
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
    it: Iterable<T>,
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
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
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
    it: Iterable<T>,
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
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
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
    it: Iterable<T>,
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
): Iterable<Out<Return4>>;

export function thruIt<
    T, Return1,
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
    it: Iterable<T>,
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
): Iterable<Out<Return4>>;

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
