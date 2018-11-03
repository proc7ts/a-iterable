import { filterIt, flatMapIt, mapIt } from './transform';

describe('filterIt', () => {
  it('filters elements', () => {
    expect([...filterIt([11, 22, 33], element => element > 11)]).toEqual([22, 33]);
  });
  it('does not filter empty iterable', () => {
    expect([...filterIt([], () => true)]).toEqual([]);
  });
});

describe('flatMapIt', () => {
  it('maps and flattens elements', () => {

    const elements = [11, 22, 33];

    expect([...flatMapIt(elements, element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
  });
});

describe('mapIt', () => {
  it('converts elements', () => {

    const elements = [11, 22, 33];

    expect([...mapIt(elements, element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
  });
});
