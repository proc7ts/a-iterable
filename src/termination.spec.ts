import { itsEach, itsEmpty, itsEvery, itsFirst, itsLast, itsReduction } from './termination';
import { RevertibleIterable } from './revertible-iterable';

describe('itsEach', () => {
  it('iterates over elements', () => {

    const elements = [11, 22, 33];
    const spy = jasmine.createSpy('action');

    itsEach(elements, spy);

    expect(spy.calls.allArgs()).toEqual([[11], [22], [33]]);
  });
  it('does not iterate over empty iterable elements', () => {

    const spy = jasmine.createSpy('action');

    itsEach([], spy);

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('itsEmpty', () => {
  it('detects empty iterable', () => {
    expect(itsEmpty([])).toBe(true);
  });
  it('detects non-empty iterable', () => {
    expect(itsEmpty([1])).toBe(false);
  });
});

describe('itsEvery', () => {
  it('returns `true` for empty iterable', () => {
    expect(itsEvery([], () => false)).toBe(true);
  });
  it('returns `true` when all elements pass the test', () => {
    expect(itsEvery([1, 2, 3], element => element > 0)).toBe(true);
  });
  it('returns `false` when some elements do not pass the test', () => {
    expect(itsEvery([1, 2, 3], element => element > 1)).toBe(false);
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

describe('itsReduction', () => {
  it('reduces value', () => {
    expect(itsReduction([11, 22, 33], (prev, element) => prev + element, 1)).toBe(67);
  });
  it('returns initial value on empty iterable', () => {
    expect(itsReduction([], (prev, element) => prev + element, 1)).toBe(1);
  });
});
