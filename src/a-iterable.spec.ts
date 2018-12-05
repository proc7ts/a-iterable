import { passIf } from 'call-thru';
import { AIterable, toAIterable } from './a-iterable';
import { IterableClass } from './api';
import { RevertibleIterable } from './revertible-iterable';
import { augmentArrays } from './specs';
import { thruIt } from './thru';
import { itsIterator, makeIt } from './util';

describe('AIterable', () => {

  let elements: number[];
  let iter: AIterable<number>;
  let none: AIterable<number>;

  beforeEach(() => {
    elements = [11, 22, 33];
    iter = AIterable.of({
      [Symbol.iterator]() {
        return elements.values();
      },
    });
    none = AIterable.none();
  });

  describe('none', () => {
    it('has no elements', () => {
      expect([...none]).toEqual([]);
    });
    describe('reverse', () => {
      it('returns the same instance', () => {
        expect(none.reverse()).toBe(none);
      });
    });
  });

  describe('is', () => {
    beforeEach(() => {
      augmentArrays();
    });
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
      expect(AIterable.of(elements)).toBe(elements);
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
    it('converts revertible iterable to `AIterable`', () => {

      const it: RevertibleIterable<number> = {
        [Symbol.iterator]() {
          return elements.values();
        },
        reverse() {
          throw new Error('Unsupported');
        },
      };

      expect([...AIterable.from(it)]).toEqual(elements);
    });
  });

  describe('every', () => {
    it('returns `true` for empty iterable', () => {
      expect(none.every(() => false)).toBe(true);
    });
    it('returns `true` when all elements pass the test', () => {
      expect(iter.every(element => element > 0)).toBe(true);
    });
    it('returns `false` when some elements do not pass the test', () => {
      expect(iter.every(element => element > 20)).toBe(false);
    });
  });

  describe('filter', () => {
    it('filters elements', () => {
      expect([...iter.filter(element => element > 11)]).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...none.filter(() => true)]).toEqual([]);
    });
    it('filters elements in reverse order', () => {
      expect([...iter.filter(element => element > 11).reverse()]).toEqual([33, 22]);
    });
  });

  describe('flatMap', () => {
    it('maps and flattens elements', () => {
      expect([...iter.flatMap(element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens elements in reverse order', () => {
      expect([...iter.flatMap(element => [element, element + 1]).reverse()]).toEqual([34, 33, 23, 22, 12, 11]);
    });
  });

  describe('forEach', () => {
    it('iterates over elements', () => {

      const spy = jest.fn();

      iter.forEach(spy);

      expect(spy.mock.calls).toEqual([[11], [22], [33]]);
    });
    it('does not iterate over empty iterable elements', () => {

      const spy = jest.fn();

      none.forEach(spy);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('converts elements', () => {
      expect([...iter.map(element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });
    it('converts elements in reverse order', () => {
      expect([...iter.map(element => `${element}!`).reverse()]).toEqual(['33!', '22!', '11!']);
    });
  });

  describe('reduce', () => {
    it('reduces value', () => {
      expect(iter.reduce((prev, element) => prev + element, 1)).toBe(67);
    });
    it('returns initial value on empty iterable', () => {
      expect(none.reduce((prev, element) => prev + element, 1)).toBe(1);
    });
  });

  describe('reverse', () => {
    it('reverts elements', () => {
      expect([...iter.reverse()]).toEqual(elements.reverse());
    });
    it('reverts element with default implementation', () => {

      class DefaultIterable extends AIterable<number> {

        [Symbol.iterator](): Iterator<number> {
          return elements.values();
        }

      }

      const it = new DefaultIterable();

      expect([...it.reverse()]).toEqual(elements.reverse());
    });
    it('returns original elements when called for the second time', () => {
      expect([...iter.reverse().reverse()]).toEqual([...iter]);
    });
  });

  describe('thru', () => {
    it('transforms elements', () => {

      const outcome: AIterable<number> = iter.thru(
          n => n + 1,
      );

      expect([...outcome]).toEqual([12, 23, 34]);
    });
    it('removes skipped elements', () => {

      const outcome: Iterable<number> = iter.thru(
          passIf((n: number) => n > 20),
          n => n + 1,
      );

      expect([...outcome]).toEqual([23, 34]);
    });
    it('transforms elements in reverse order', () => {

      const outcome: AIterable<number> = iter.thru(
          n => n + 1,
      ).reverse();

      expect([...outcome]).toEqual([34, 23, 12]);
    });
  });

});

describe('toAIterable', () => {

  class BaseIterable implements RevertibleIterable<number> {
    * [Symbol.iterator](): Iterator<number> {
      yield 1;
      yield 2;
      yield 3;
    }
    reverse() {
      return makeIt(() => itsIterator([3, 3, 3]));
    }
  }

  let ExtendedIterable: IterableClass<BaseIterable & AIterable<number>>;
  let extended: BaseIterable & AIterable<number> ;

  beforeEach(() => {
    ExtendedIterable = toAIterable(BaseIterable);
    extended = new ExtendedIterable();
  });

  it('implements missing methods', () => {
    expect(extended.every(x => x > 0)).toBe(true);
    expect([...extended.filter(x => x > 1)]).toEqual([2, 3]);
  });
  it('does not override implemented methods', () => {
    expect([...extended.reverse()]).toEqual([3, 3, 3]);
  });
});
