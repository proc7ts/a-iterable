import { reverseIt } from './reverse';
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
    delete (iter as any).reverse;
    expect([...reverseIt(iter)]).toEqual(elements.reverse());
  });
});
