import { passIf } from 'call-thru';
import { thruIt } from './thru';

describe('thruIt', () => {
  it('transforms elements', () => {

    const outcome: Iterable<number> = thruIt(
        [1, 2, 3],
        n => n * n,
    );

    expect([...outcome]).toEqual([1, 4, 9]);
  });
  it('removes skipped elements', () => {

    const outcome: Iterable<number> = thruIt(
        [1, 2, 3],
        passIf((n: number) => n > 1),
        n => n * n,
    );

    expect([...outcome]).toEqual([4, 9]);
  });
});
