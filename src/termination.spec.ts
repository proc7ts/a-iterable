import { RevertibleIterable } from './revertible-iterable';
import { itsEach, itsEmpty, itsEvery, itsFirst, itsLast, itsReduction, itsSome } from './termination';

describe('itsEach', () => {
  it('iterates over elements', () => {

    const elements = [11, 22, 33];
    const spy = jest.fn();

    itsEach(elements, spy);

    expect(spy.mock.calls).toEqual([[11], [22], [33]]);
  });
  it('does not iterate over empty iterable elements', () => {

    const spy = jest.fn();

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

describe('itsSome', () => {
  it('returns `false` for empty iterable', () => {
    expect(itsSome([], () => true)).toBe(false);
  });
  it('returns `true` when at least one elements pass the test', () => {
    expect(itsSome([1, 2, 3], element => element > 1)).toBe(true);
  });
  it('returns `false` when all elements do not pass the test', () => {
    expect(itsSome([1, 2, 3], element => element < 0)).toBe(false);
  });
});

describe('itsFirst', () => {
  it('finds the first element', () => {
    expect(itsFirst([1, 2, 3])).toBe(1);
  });
  it('returns `undefined` for empty iterable', () => {
    expect(itsFirst([])).toBeUndefined();
  });
  it('returns `undefined` for generator returning value', () => {
    expect(itsFirst(gen())).toBeUndefined();

    // eslint-disable-next-line require-yield
    function *gen(): Generator<string, string> {
      return 'returned';
    }
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
      },
    };

    expect(itsLast(it)).toBe(3);
  });
});

describe('itsReduction', () => {
  it('reduces value', () => {
    expect(itsReduction([11, 22, 33], (prev, element) => prev + element, 1)).toBe(67);
  });
  it('returns initial value on empty iterable', () => {
    expect(itsReduction<number, number>([], (prev, element) => prev + element, 1)).toBe(1);
  });
});
