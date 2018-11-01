import { AIterable } from './a-iterable';

describe('AIterable', () => {

  let elements: number[];
  let iter: AIterable<number>;
  let empty: AIterable<number>;

  beforeEach(() => {
    elements = [11, 22, 33];
    iter = AIterable.of({
      [Symbol.iterator]() {
        return elements[Symbol.iterator]();
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
      expect<Iterable<number>>(AIterable.of(elements)).toBe(elements);
    });
    it('returns `AIterable` itself', () => {
      expect(AIterable.of(iter)).toBe(iter);
    });
    it('returns new implementation for others', () => {
      expect<Iterable<number>>(iter).not.toBe(elements);
    });
  });

  describe('from', () => {
    it('converts array to iterable', () => {
      expect<Iterable<number>>(AIterable.from(elements)).not.toBe(elements);
      expect([...AIterable.from(elements)]).toEqual(elements);
    });
  });

  describe('filter', () => {
    it('filters elements', () => {
      expect([...iter.filter(element => element > 11)]).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...empty.filter(() => true)]).toEqual([]);
    });
  });

  describe('flatMap', () => {
    it('maps and flattens elements', () => {
      expect([...iter.flatMap(element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
    });
  });

  describe('forEach', () => {
    it('iterates over elements', () => {

      const spy = jasmine.createSpy('action');

      iter.forEach(spy);

      expect(spy.calls.allArgs()).toEqual([[11], [22], [33]]);
    });
    it('does not iterate over empty iterable elements', () => {

      const spy = jasmine.createSpy('action');

      empty.forEach(spy);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('converts elements', () => {
      expect([...iter.map(element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });
  });

  describe('reduce', () => {
    it('reduces value', () => {
      expect(iter.reduce((prev, element) => prev + element, 1)).toBe(67);
    });
    it('returns initial value on empty iterable', () => {
      expect(empty.reduce((prev, element) => prev + element, 1)).toBe(1);
    });
  });

});
