import { itsRevertible } from './revertible-iterable';
import { itsIterator, makeIt } from './util';

describe('itsIterator', () => {
  it('accesses iterator', () => {

    const iterable: Iterable<number> = {
      * [Symbol.iterator]() {
        yield 1;
      }
    };

    expect(itsIterator(iterable).next()).toEqual({ done: false, value: 1 });
  });
});

describe('makeIt', () => {
  it('constructs one-way iterator', () => {

    const elements = [1, 2, 3];
    const iterable = makeIt(() => itsIterator(elements));

    expect([...iterable]).toEqual(elements);
    expect(itsRevertible(iterable)).toBe(false);
  });
  it('constructs revertible iterator', () => {

    const elements = [1, 2, 3];
    const iterable = makeIt(() => itsIterator(elements), () => [...elements].reverse());

    expect([...iterable]).toEqual(elements);
    expect(itsRevertible(iterable)).toBe(true);
    expect([...iterable.reverse()]).toEqual([...elements].reverse());
  });
});
