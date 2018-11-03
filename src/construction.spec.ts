import { overArray, overNone } from './construction';

describe('overArray', () => {

  let elements: number[];

  beforeEach(() => {
    elements = [1, 2, 3];
  });

  it('iterates over array elements', () => {
    expect([...overArray(elements)]).toEqual(elements);
  });
  it('it is not an array', () => {
    expect(overArray(elements)).not.toEqual(elements);
  });
  it('it is revertible', () => {
    expect([...overArray(elements).reverse()]).toEqual(elements.reverse());
  });
});

describe('overNone', () => {
  it('has no elements', () => {
    expect([...overNone()]).toEqual([]);
  });
  describe('reverse', () => {
    it('returns the same instance', () => {
      expect(overNone().reverse()).toBe(overNone());
    });
  });
});
