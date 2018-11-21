import { callThru, NextCall } from 'call-thru';
import { mapIt } from './transform';
import Args = NextCall.Callee.Args;
import Last = NextCall.LastOutcome;
import Out = NextCall.Outcome;

export function thruIt<T, R>(
    it: Iterable<T>,
    fn: (this: void, arg: T) => R):
    Iterable<Last<R>>;

export function thruIt<T, R1, R2>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2):
    Iterable<Out<R1, Last<R2>>>;

export function thruIt<T, R1, R2, R3>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R3):
    Iterable<Out<R1, Out<R2, Last<R3>>>>;

export function thruIt<T, R1, R2, R3, R4>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R3,
    fn4: (this: void, ...args: Args<R3>) => R4):
    Iterable<Out<R1, Out<R2, Out<R3, Last<R4>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Last<R5>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Last<R6>>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6, R7>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Out<R6, Last<R7>>>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6, R7, R8>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7,
    fn8: (this: void, ...args: Args<R7>) => R8):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Out<R6, Out<R7, Last<R8>>>>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7,
    fn8: (this: void, ...args: Args<R7>) => R8,
    fn9: (this: void, ...args: Args<R8>) => R9):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5, Out<R6, Out<R7, Out<R8, Last<R9>>>>>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7,
    fn8: (this: void, ...args: Args<R7>) => R8,
    fn9: (this: void, ...args: Args<R8>) => R9,
    fn10: (this: void, ...args: Args<R9>) => R10):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Out<R6, Out<R7, Out<R8, Out<R9, Last<R10>>>>>>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7,
    fn8: (this: void, ...args: Args<R7>) => R8,
    fn9: (this: void, ...args: Args<R8>) => R9,
    fn10: (this: void, ...args: Args<R9>) => R10,
    fn11: (this: void, ...args: Args<R10>) => R11):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
            Last<R11>>>>>>>>>>>>;

export function thruIt<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7,
    fn8: (this: void, ...args: Args<R7>) => R8,
    fn9: (this: void, ...args: Args<R8>) => R9,
    fn10: (this: void, ...args: Args<R9>) => R10,
    fn11: (this: void, ...args: Args<R10>) => R11,
    fn12: (this: void, ...args: Args<R11>) => R12):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
            Out<R11, Last<R12>>>>>>>>>>>>>;

/**
 * Passes each element of the given iterable trough a chain of transformation passes.
 *
 * The passes are preformed by `callThru()` function.
 *
 * @returns Next iterable of transformed elements.
 */
export function thruIt<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13>(
    it: Iterable<T>,
    fn1: (this: void, arg: T) => R1,
    fn2: (this: void, ...args: Args<R1>) => R2,
    fn3: (this: void, ...args: Args<R2>) => R2,
    fn4: (this: void, ...args: Args<R3>) => R4,
    fn5: (this: void, ...args: Args<R4>) => R5,
    fn6: (this: void, ...args: Args<R5>) => R6,
    fn7: (this: void, ...args: Args<R6>) => R7,
    fn8: (this: void, ...args: Args<R7>) => R8,
    fn9: (this: void, ...args: Args<R8>) => R9,
    fn10: (this: void, ...args: Args<R9>) => R10,
    fn11: (this: void, ...args: Args<R10>) => R11,
    fn12: (this: void, ...args: Args<R11>) => R12,
    fn13: (this: void, ...args: Args<R12>) => R13):
    Iterable<Out<R1, Out<R2, Out<R3, Out<R4, Out<R5,
        Out<R6, Out<R7, Out<R8, Out<R9, Out<R10,
            Out<R11, Out<R12, Last<R13>>>>>>>>>>>>>>;

export function thruIt<T, R>(
    it: Iterable<T>,
    ...fns: ((...args: any[]) => any)[]): Iterable<R> {

  const thru: (element: T) => R = (callThru as any)(...fns);

  return mapIt(it, thru);
}
