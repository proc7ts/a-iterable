import { asis, nextArgs, nextSkip } from '@proc7ts/call-thru';
import { nextIterate } from './next-iterate';
import { thruIt } from './thru-it';

describe('nextIterate', () => {
  it('iterates over elements', () => {

    const result: Iterable<number> = thruIt(
        [1, 2, 3, 4],
        n => nextIterate(new Array(n).fill(String(n))),
        n => n < 4 ? n : nextSkip,
    );

    expect([...result]).toEqual(['1', '2', '2', '3', '3', '3']);
  });
  it('treats next calls as is', () => {

    const result: Iterable<[number]> = thruIt(
        [1, 2, 3],
        n => nextIterate([nextArgs(n * 2)]),
        asis,
    );

    expect([...result]).toEqual([[2], [4], [6]]);
  });
});
