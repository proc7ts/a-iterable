import { reverseArray, reverseIt } from './reverse';
import { RevertibleIterable } from './revertible-iterable';
import Mocked = jest.Mocked;

describe('reverseIt', () => {

  let iter: Mocked<RevertibleIterable<number>>;
  let elements: number[];

  beforeEach(() => {
    elements = [1, 2, 3];
    iter = {
      [Symbol.iterator]() {
        return elements.values();
      },
      reverse: jest.fn(() => [...elements].reverse()) as any,
    };
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
    const it: Mocked<RevertibleIterable<number>> = {
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
