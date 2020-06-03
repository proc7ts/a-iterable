import { overArray, reverseArray } from './array';
import { reverseIt } from './reverse';
import { RevertibleIterable } from './revertible-iterable';

describe('overArray', () => {

  let elements: number[];

  beforeEach(() => {
    elements = [1, 2, 3];
  });

  it('iterates over array elements', () => {
    expect([...overArray(elements)]).toEqual(elements);
  });
  it('is not an array itself', () => {
    expect(overArray(elements)).not.toBe(elements);
  });
  it('is revertible', () => {
    expect([...overArray(elements).reverse()]).toEqual(elements.reverse());
  });
});

describe('reverseArray', () => {
  it('reverts array elements', () => {
    expect([...reverseArray([1, 2, 3])]).toEqual([3, 2, 1]);
  });
  it('reverts elements using source `reverse()` method', () => {

    const elements = [1, 2, 3];
    const reverted = [...elements].reverse();
    const it: jest.Mocked<RevertibleIterable<number>> = {
      reverse: jest.fn(() => reverted),
    } as any;

    expect([...reverseIt(it)]).toEqual(reverted);
    expect(it.reverse).toHaveBeenCalled();
  });
  it('does not revert array elements in-place', () => {

    const elements = [1, 2, 3];

    reverseArray(elements);

    expect(elements).toEqual([1, 2, 3]);
  });
});
