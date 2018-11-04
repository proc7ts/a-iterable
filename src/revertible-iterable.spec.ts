import { itsRevertible } from './revertible-iterable';

describe('itsRevertible', () => {
  it('recognizes arrays as revertible', () => {
    expect(itsRevertible([])).toBe(true);
  });
  it('recognizes simple iterables not to be revertible', () => {
    expect(itsRevertible({
      * [Symbol.iterator]() {
        yield 1;
      },
    })).toBe(false);
  });
});
