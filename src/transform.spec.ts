import { flatMapIt, mapIt } from './transform';

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
