import { itsEmpty, itsFirst } from './iteration';

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
