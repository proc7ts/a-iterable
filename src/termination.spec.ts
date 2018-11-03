import { itsEmpty, itsFirst, itsLast } from './termination';
import { RevertibleIterable } from './revertible-iterable';

describe('itsEmpty', () => {
  it('detects empty iterable', () => {
    expect(itsEmpty([])).toBe(true);
  });
  it('detects non-empty iterable', () => {
    expect(itsEmpty([1])).toBe(false);
  });
});

describe('itsFirst', () => {
  it('finds the first element', () => {
    expect(itsFirst([1, 2, 3])).toBe(1);
  });
  it('returns `undefined` for empty iterable', () => {
    expect(itsFirst([])).toBeUndefined();
  });
});

describe('itsLast', () => {
  it('finds the last element of array', () => {
    expect(itsLast([1, 2, 3])).toBe(3);
  });
  it('finds the last element of revertible iterable', () => {

    const it: RevertibleIterable<number> = {
      [Symbol.iterator]() {
        throw Error('Unsupported');
      },
      reverse() {
        return [3, 2, 1];
      },
    };

    expect(itsLast(it)).toBe(3);
  });
  it('finds the last element of simple iterable', () => {

    const it: Iterable<number> = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      }
    };

    expect(itsLast(it)).toBe(3);
  });
});
