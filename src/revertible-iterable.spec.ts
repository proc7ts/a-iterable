import { itsRevertible, reverseArray, reverseIterable, RevertibleIterable } from './revertible-iterable';
import SpyObj = jasmine.SpyObj;

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

describe('reverseIterable', () => {
  it('reverts array elements', () => {
    expect([...reverseIterable([1, 2, 3])]).toEqual([3, 2, 1]);
  });

  it('reverts iterable elements', () => {

    const it: Iterable<number> = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      }
    };

    expect([...reverseIterable(it)]).toEqual([3, 2, 1]);
  });
});

describe('reverseArray', () => {
  it('reverts array elements', () => {
    expect([...reverseArray([1, 2, 3])]).toEqual([3, 2, 1]);
  });
  it('reverts elements using source `reverse()` method', () => {

    const elements = [1, 2, 3];
    const reverted = [...elements].reverse();
    const it: SpyObj<RevertibleIterable<number>> = jasmine.createSpyObj('it', ['reverse']);

    it.reverse.and.returnValue(reverted);

    expect([...reverseIterable(it)]).toEqual(reverted);
    expect(it.reverse).toHaveBeenCalled();
  });
  it('does not revert array elements in-place', () => {

    const elements = [1, 2, 3];

    reverseArray(elements);

    expect(elements).toEqual([1, 2, 3]);
  });
});
