import { passIf } from 'call-thru';
import { thruIt } from './thru';

describe('thruIt', () => {
  it('transforms elements', () => {
    expect([
      ...thruIt(
          [1, 2, 3],
          n => n * n,
          passIf(n => n > 1),
      )
    ]).toEqual([undefined, 4, 9]);
  });
});
