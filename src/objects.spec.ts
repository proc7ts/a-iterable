import { overEntries, overKeys } from './objects';

describe('overKeys', () => {

  let obj: any;

  beforeEach(() => {
    obj = {
      a: 1,
      [1]: 'two',
      [Symbol.iterator]: null,
    };
  });

  it('iterates over object keys', () => {

    const keys = [...overKeys(obj)];

    expect(keys).toContain('a');
    expect(keys).toContain('1');
    expect(keys).toContain(Symbol.iterator);
  });
  it('iterates over object keys in reverse order', () => {

    const keys = overKeys(obj);

    expect([...keys.reverse()]).toEqual([...keys].reverse());
  });
});

describe('overEntries', () => {

  let obj: any;

  beforeEach(() => {
    obj = {
      a: 1,
      [1]: 'two',
      [Symbol.iterator]: null,
    };
  });

  it('iterates over object entries', () => {

    const entries = [...overEntries(obj)];

    expect(entries).toContainEqual(['a', 1]);
    expect(entries).toContainEqual(['1', 'two']);
    expect(entries).toContainEqual([Symbol.iterator, null]);
  });
  it('iterates over object entries in reverse order', () => {

    const entries = overEntries(obj);

    expect([...entries.reverse()]).toEqual([...entries].reverse());
  });
});
