import { overNone } from './none';

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
