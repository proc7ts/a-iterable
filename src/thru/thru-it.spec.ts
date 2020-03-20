import { nextArgs, nextSkip } from '@proc7ts/call-thru';
import { thruIt } from './thru-it';

describe('thruIt', () => {
  it('transforms elements', () => {

    const outcome: Iterable<number> = thruIt(
        [1, 2, 3],
        n => n * n,
    );

    expect([...outcome]).toEqual([1, 4, 9]);
  });
  it('transforms elements with multi-argument transformers', () => {

    const outcome: Iterable<number> = thruIt(
        [[1, 2], [3, 4]],
        ([a, b]) => nextArgs(a, b),
        (a, b) => a * b,
    );

    expect([...outcome]).toEqual([2, 12]);
  });
  it('transforms elements to tuples', () => {

    const outcome: Iterable<[number, string]> = thruIt(
        [1, 2, 3],
        n => [n, new Array(n).fill(n).join('')],
    );

    expect([...outcome]).toEqual([[1, '1'], [2, '22'], [3, '333']]);
  });
  it('removes skipped elements', () => {

    const outcome: Iterable<number> = thruIt(
        [1, 2, 3],
        n => n > 1 ? n : nextSkip,
        (n: number) => n * n,
    );

    expect([...outcome]).toEqual([4, 9]);
  });
});
