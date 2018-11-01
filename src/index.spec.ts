import { AIterable } from './index';

describe('AIterable', () => {

  let items: number[];
  let iter: AIterable<number>;
  let empty: AIterable<number>;

  beforeEach(() => {
    items = [11, 22, 33];
    iter = AIterable.of({
      [Symbol.iterator]() {
        return items[Symbol.iterator]();
      },
    });
    empty = AIterable.of({
      [Symbol.iterator]() {
        return [][Symbol.iterator]();
      },
    });
  });

  describe('is', () => {
    it('returns `true` for arrays', () => {
      expect(AIterable.is([])).toBe(true);
    });
    it('returns `true` for `AIterable`', () => {
      expect(AIterable.is(iter)).toBe(true);
    });
    it('returns `false` for others', () => {
      expect(AIterable.is({
        *[Symbol.iterator]() {
          yield 1;
        },
      })).toBe(false);
    });
  });

  describe('of', () => {
    it('returns array itself', () => {
      expect(AIterable.of(items)).toBe(items);
    });
    it('returns `AIterable` itself', () => {
      expect(AIterable.of(iter)).toBe(iter);
    });
    it('returns new implementation for others', () => {
      expect(iter).not.toBe(items);
    });
  });

  describe('forEach', () => {
    it('iterates over items', () => {

      const spy = jasmine.createSpy('action');

      iter.forEach(spy);

      expect(spy.calls.allArgs()).toEqual([[11], [22], [33]]);
    });
    it('does not iterate over empty iterable items', () => {

      const spy = jasmine.createSpy('action');

      empty.forEach(spy);

      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('reduce', () => {
    it('reduces value', () => {
      expect(iter.reduce((prev, item) => prev + item, 1)).toBe(67);
    });
    it('returns initial value on empty iterable', () => {
      expect(empty.reduce((prev, item) => prev + item, 1)).toBe(1);
    });
  });
  describe('filter', () => {
    it('filters items', () => {
      expect([...iter.filter(item => item > 11)]).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...empty.filter(() => true)]).toEqual([]);
    });
  });
});
