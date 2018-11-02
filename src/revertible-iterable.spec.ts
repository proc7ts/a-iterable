import { itsRevertible, reverseArray } from './revertible-iterable';

describe('itsRevertible', () => {
  it('recognizes arrays as revertible', () => {
    expect(itsRevertible([])).toBe(true);
  });
  it('recognizes simple iterables not to be revertible', () => {
    expect(itsRevertible({
      *[Symbol.iterator]() {
        yield 1;
      }
    })).toBe(false);
  });
});

describe('reverseArray', () => {
  it('reverts array elements', () => {
    expect([...reverseArray([1, 2, 3])]).toEqual([3, 2, 1]);
  });
});
