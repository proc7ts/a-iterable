import { reverseArray, reverseIt } from './reverse';
import { RevertibleIterable } from './revertible-iterable';
import SpyObj = jasmine.SpyObj;

describe('reverseIt', () => {

  let iter: SpyObj<RevertibleIterable<number>>;
  let elements: number[];

  beforeEach(() => {
    iter = jasmine.createSpyObj('iter', ['reverse']);
    elements = [1, 2, 3];
    (iter as Iterable<number>)[Symbol.iterator] = () => elements.values();
    iter.reverse.and.returnValue([...elements].reverse());
  });

  it('reverts array elements', () => {
    expect([...reverseIt(elements)]).toEqual(elements.reverse());
  });
  it('reverts revertible iterable elements', () => {
    expect([...reverseIt(iter)]).toEqual(elements.reverse());
  });
  it('reverts non-revertible iterable elements', () => {
    delete iter.reverse;
    expect([...reverseIt(iter)]).toEqual(elements.reverse());
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

    expect([...reverseIt(it)]).toEqual(reverted);
    expect(it.reverse).toHaveBeenCalled();
  });
  it('does not revert array elements in-place', () => {

    const elements = [1, 2, 3];

    reverseArray(elements);

    expect(elements).toEqual([1, 2, 3]);
  });
});
