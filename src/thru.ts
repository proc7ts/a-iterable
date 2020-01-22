/**
 * @packageDocumentation
 * @module a-iterable
 */
import { callThru, NextCall, nextEach, PassedThru } from 'call-thru';
import Last = NextCall.LastResult;
import Out = NextCall.Outcome;
import Result = NextCall.CallResult;

/**
 * Passes each element of the given iterable trough a chain of transformation passes.
 *
 * The passes are preformed by `callThru()` function.
 *
 * @returns Next iterable of transformed elements.
 */
export function thruIt<T, R1>(
    it: Iterable<T>,
    fn: (this: void, arg: T) => Last<R1>,
): Iterable<PassedThru.Item<R1>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => Last<R2>,
): Iterable<PassedThru.Item<Out<R1, R2>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => Last<R3>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, R3>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => Last<R4>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Last<R4>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => Last<R5>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, R5>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => Last<R6>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    R6>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => Last<R7>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, R7>>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7 extends Result<P8>,
    P8 extends any[], R8>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => R7,
    fn8: (this: void, ...args: P8) => Last<R8>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, Out<R7, R8>>>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7 extends Result<P8>,
    P8 extends any[], R8 extends Result<P9>,
    P9 extends any[], R9>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => R7,
    fn8: (this: void, ...args: P8) => R8,
    fn9: (this: void, ...args: P9) => Last<R9>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, Out<R7, Out<R8, R9>>>>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7 extends Result<P8>,
    P8 extends any[], R8 extends Result<P9>,
    P9 extends any[], R9 extends Result<P10>,
    P10 extends any[], R10>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => R7,
    fn8: (this: void, ...args: P8) => R8,
    fn9: (this: void, ...args: P9) => R9,
    fn10: (this: void, ...args: P10) => Last<R10>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, Out<R7, Out<R8, Out<R9, R10>>>>>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7 extends Result<P8>,
    P8 extends any[], R8 extends Result<P9>,
    P9 extends any[], R9 extends Result<P10>,
    P10 extends any[], R10 extends Result<P11>,
    P11 extends any[], R11>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => R7,
    fn8: (this: void, ...args: P8) => R8,
    fn9: (this: void, ...args: P9) => R9,
    fn10: (this: void, ...args: P10) => R10,
    fn11: (this: void, ...args: P11) => Last<R11>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
        R11>>>>>>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7 extends Result<P8>,
    P8 extends any[], R8 extends Result<P9>,
    P9 extends any[], R9 extends Result<P10>,
    P10 extends any[], R10 extends Result<P11>,
    P11 extends any[], R11 extends Result<P12>,
    P12 extends any[], R12>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => R7,
    fn8: (this: void, ...args: P8) => R8,
    fn9: (this: void, ...args: P9) => R9,
    fn10: (this: void, ...args: P10) => R10,
    fn11: (this: void, ...args: P11) => R11,
    fn12: (this: void, ...args: P12) => Last<R12>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
        Out<R11, R12>>>>>>>>>>>>>;

export function thruIt<
    T, R1 extends Result<P2>,
    P2 extends any[], R2 extends Result<P3>,
    P3 extends any[], R3 extends Result<P4>,
    P4 extends any[], R4 extends Result<P5>,
    P5 extends any[], R5 extends Result<P6>,
    P6 extends any[], R6 extends Result<P7>,
    P7 extends any[], R7 extends Result<P8>,
    P8 extends any[], R8 extends Result<P9>,
    P9 extends any[], R9 extends Result<P10>,
    P10 extends any[], R10 extends Result<P11>,
    P11 extends any[], R11 extends Result<P12>,
    P12 extends any[], R12 extends Result<P13>,
    P13 extends any[], R13>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: P2) => R2,
    fn3: (this: void, ...args: P3) => R3,
    fn4: (this: void, ...args: P4) => R4,
    fn5: (this: void, ...args: P5) => R5,
    fn6: (this: void, ...args: P6) => R6,
    fn7: (this: void, ...args: P7) => R7,
    fn8: (this: void, ...args: P8) => R8,
    fn9: (this: void, ...args: P9) => R9,
    fn10: (this: void, ...args: P10) => R10,
    fn11: (this: void, ...args: P11) => R11,
    fn12: (this: void, ...args: P12) => R12,
    fn13: (this: void, ...args: P13) => Last<R13>,
): Iterable<PassedThru.Item<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
    Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
        Out<R11, Out<R12, R13>>>>>>>>>>>>>>;

export function thruIt<T, R>(
    it: Iterable<T>,
    ...fns: ((...args: any[]) => any)[]
): Iterable<PassedThru.Item<R>> {

  const thru: () => Iterable<PassedThru.Item<R>> = (callThru as any)(
      nextEach(it),
      ...fns,
  );

  return thru();
}
